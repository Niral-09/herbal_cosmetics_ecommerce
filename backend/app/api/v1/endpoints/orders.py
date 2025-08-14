from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import Optional
from app.api.deps import get_db_dep, optional_auth, get_current_active_user, require_admin_role
from app.schemas.order import OrderCreate, OrderResponse, OrderListResponse, OrderUpdate, OrderStatusUpdate, OrderCancellationRequest
from app.models.cart_item import CartItem
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus, FulfillmentStatus
from app.services.order_service import generate_order_number, capture_item_snapshot, adjust_inventory_on_create, release_inventory_on_cancel, add_status_history
from app.services.cart_service import cart_totals, estimate_shipping

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("", response_model=OrderResponse)
async def create_order(payload: OrderCreate, request: Request, db: Session = Depends(get_db_dep), current_user=Depends(optional_auth)):
    user_id = current_user.id if current_user else None
    if not payload.items:
        raise HTTPException(status_code=400, detail="No items to order")
    order = Order(
        order_number=generate_order_number(db),
        user_id=user_id,
        customer_email=payload.customer_email,
        customer_phone=payload.customer_phone,
        shipping_address=payload.shipping_address.dict(),
        billing_address=(payload.billing_address.dict() if payload.billing_address else None),
    )
    items = []
    subtotal = 0.0
    total_weight = 0.0
    for it in payload.items:
        snap = capture_item_snapshot(db, it.product_id, it.variant_id, it.quantity)
        items.append(snap)
        subtotal += float(snap.total_price)
        from app.models.product import Product
        p = db.query(Product).filter(Product.id == it.product_id).first()
        w = float(p.weight) if p and p.weight is not None else 0.2
        total_weight += w * it.quantity
    shipping = estimate_shipping(total_weight)
    order.subtotal = subtotal
    order.shipping_amount = shipping
    order.total_amount = subtotal + shipping
    db.add(order)
    db.commit()
    db.refresh(order)
    for snap in items:
        snap.order_id = order.id
        db.add(snap)
    db.commit()
    adjust_inventory_on_create(db, items)
    db.commit()
    db.refresh(order)
    return order

@router.post("/from-cart", response_model=OrderResponse)
async def create_order_from_cart(request: Request, db: Session = Depends(get_db_dep), current_user=Depends(optional_auth)):
    # Build order from current cart (user or session), validate, and clear on success
    user_id = current_user.id if current_user else None
    from app.api.v1.endpoints.cart import SESSION_HEADER
    sess_id = request.headers.get(SESSION_HEADER) if not user_id else None
    q = db.query(CartItem)
    q = q.filter(CartItem.user_id == user_id) if user_id else q.filter(CartItem.session_id == sess_id)
    items = q.all()
    if not items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    # Simple validation: ensure products still available
    from app.models.product import Product
    from app.models.product_variant import ProductVariant
    subtotal = 0.0
    total_weight = 0.0
    order_items = []
    for it in items:
        product = db.query(Product).filter(Product.id == it.product_id, Product.is_active == True).first()
        if not product:
            raise HTTPException(status_code=400, detail="A product in cart is no longer available")
        variant = db.query(ProductVariant).filter(ProductVariant.id == it.variant_id, ProductVariant.product_id == product.id, ProductVariant.is_active == True).first() if it.variant_id else None
        # snapshot
        snap = capture_item_snapshot(db, it.product_id, it.variant_id, it.quantity)
        order_items.append(snap)
        subtotal += float(snap.total_price)
        w = float(product.weight) if product and product.weight is not None else 0.2
        total_weight += w * it.quantity
    shipping = estimate_shipping(total_weight)
    # Create order with minimal required info from user profile or placeholder
    if current_user:
        customer_email = getattr(current_user, "email", None) or "guest@example.com"
        customer_phone = getattr(current_user, "phone", None) or "0000000000"
    else:
        # For true guest, frontend must provide email/phone via headers or separate flow; using placeholders here
        customer_email = "guest@example.com"
        customer_phone = "0000000000"
    order = Order(
        order_number=generate_order_number(db),
        user_id=user_id,
        customer_email=customer_email,
        customer_phone=customer_phone,
    )
    order.subtotal = subtotal
    order.shipping_amount = shipping
    order.total_amount = subtotal + shipping
    db.add(order)
    db.commit()
    db.refresh(order)
    for snap in order_items:
        snap.order_id = order.id
        db.add(snap)
    db.commit()
    adjust_inventory_on_create(db, order_items)
    db.commit()
    # clear cart
    q.delete(synchronize_session=False)
    db.commit()
    db.refresh(order)
    return order

@router.get("", response_model=OrderListResponse)
async def list_my_orders(db: Session = Depends(get_db_dep), current_user=Depends(get_current_active_user), page: int = 1, limit: int = 20):
    q = db.query(Order).filter(Order.user_id == current_user.id)
    total = q.count()
    items = q.order_by(Order.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    return {"items": items, "total": total, "page": page, "limit": limit}

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str, db: Session = Depends(get_db_dep), current_user=Depends(optional_auth)):
    q = db.query(Order).filter(Order.id == order_id)
    if current_user and (not current_user.is_admin):
        q = q.filter(Order.user_id == current_user.id)
    order = q.first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/{order_id}/cancel")
async def cancel_order(order_id: str, payload: OrderCancellationRequest, db: Session = Depends(get_db_dep), current_user=Depends(get_current_active_user)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status not in [OrderStatus.pending, OrderStatus.confirmed, OrderStatus.processing]:
        raise HTTPException(status_code=400, detail="Order cannot be cancelled at this stage")
    release_inventory_on_cancel(db, order.items)
    add_status_history(db, order, OrderStatus.cancelled, reason=payload.reason)
    db.commit()
    return {"message": "Order cancelled", "success": True}

# Admin
admin_router = APIRouter(prefix="/admin/orders", tags=["admin-orders"])

@admin_router.get("", response_model=OrderListResponse, dependencies=[Depends(require_admin_role)])
async def admin_list_orders(db: Session = Depends(get_db_dep), page: int = 1, limit: int = 20, status: Optional[str] = None):
    q = db.query(Order)
    if status:
        q = q.filter(Order.status == status)
    total = q.count()
    items = q.order_by(Order.created_at.desc()).offset((page - 1)*limit).limit(limit).all()
    return {"items": items, "total": total, "page": page, "limit": limit}

@admin_router.get("/{order_id}", response_model=OrderResponse, dependencies=[Depends(require_admin_role)])
async def admin_get_order(order_id: str, db: Session = Depends(get_db_dep)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@admin_router.put("/{order_id}/status", dependencies=[Depends(require_admin_role)])
async def admin_update_status(order_id: str, payload: OrderStatusUpdate, db: Session = Depends(get_db_dep), current_user=Depends(get_current_active_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    try:
        new_status = OrderStatus(payload.status)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid status")
    add_status_history(db, order, new_status, reason=payload.reason, notes=payload.notes, changed_by=current_user.id)
    db.commit()
    return {"message": "Status updated", "success": True}

