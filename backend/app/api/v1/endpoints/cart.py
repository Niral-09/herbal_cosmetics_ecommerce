from fastapi import APIRouter, Depends, HTTPException, Request, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.api.deps import get_db_dep, optional_auth, get_current_active_user
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartSummary, CartItemResponse
from app.models.cart_item import CartItem
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.services.cart_service import get_or_create_session, compute_item_price, ensure_stock_available, product_main_image, estimate_shipping, cart_totals

router = APIRouter(prefix="/cart", tags=["cart"])

SESSION_HEADER = "X-Session-Id"


def _resolve_identity(request: Request, db: Session, user_id: Optional[str]) -> str:
    if user_id:
        return ""
    sess_id = request.headers.get(SESSION_HEADER)
    sess_id = get_or_create_session(db, sess_id, request.headers.get("User-Agent"), request.client.host if request.client else None)
    return sess_id


def _serialize_item(db: Session, item: CartItem) -> CartItemResponse:
    product = db.query(Product).filter(Product.id == item.product_id).first()
    variant = db.query(ProductVariant).filter(ProductVariant.id == item.variant_id).first() if item.variant_id else None
    return CartItemResponse(
        id=item.id,
        product_id=item.product_id,
        variant_id=item.variant_id,
        product_name=product.name if product else "",
        variant_title=variant.title if variant else None,
        product_image=product_main_image(db, item.product_id),
        quantity=item.quantity,
        unit_price=float(item.unit_price),
        total_price=float(item.total_price),
        created_at=item.added_at,
    )

@router.get("", response_model=CartSummary)
async def get_cart(request: Request, db: Session = Depends(get_db_dep), current_user=Depends(optional_auth)):
    user_id = current_user.id if current_user else None
    session_id = _resolve_identity(request, db, user_id)
    q = db.query(CartItem)
    if user_id:
        q = q.filter(CartItem.user_id == user_id)
    else:
        q = q.filter(CartItem.session_id == session_id)
    items = q.all()
    serialized = [_serialize_item(db, it) for it in items]
    subtotal, total_items = cart_totals(db, user_id, session_id)
    # shipping estimate: sum weight of products/variants (if available); fallback per item 0.2 kg
    weight = 0.0
    for it in items:
        product = db.query(Product).filter(Product.id == it.product_id).first()
        w = float(product.weight) if product and product.weight is not None else 0.2
        weight += w * it.quantity
    shipping = estimate_shipping(weight)
    tax = 0.0
    total = subtotal + shipping + tax
    return CartSummary(items=serialized, subtotal=subtotal, total_items=total_items, estimated_tax=tax, estimated_shipping=shipping, estimated_total=total)

@router.post("/items", response_model=CartItemResponse)
async def add_item(payload: CartItemCreate, request: Request, db: Session = Depends(get_db_dep), current_user=Depends(optional_auth)):
    user_id = current_user.id if current_user else None
    session_id = _resolve_identity(request, db, user_id)
    product = db.query(Product).filter(Product.id == payload.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    variant = None
    if payload.variant_id:
        variant = db.query(ProductVariant).filter(ProductVariant.id == payload.variant_id, ProductVariant.product_id == product.id, ProductVariant.is_active == True).first()
        if not variant:
            raise HTTPException(status_code=400, detail="Variant not available")
    ensure_stock_available(product, variant, payload.quantity)
    unit_price = compute_item_price(product, variant)
    # merge with existing
    q = db.query(CartItem).filter(CartItem.product_id == product.id)
    q = q.filter(CartItem.user_id == user_id) if user_id else q.filter(CartItem.session_id == session_id)
    if payload.variant_id:
        q = q.filter(CartItem.variant_id == payload.variant_id)
    existing = q.first()
    if existing:
        new_qty = existing.quantity + payload.quantity
        ensure_stock_available(product, variant, new_qty)
        existing.quantity = new_qty
        existing.unit_price = unit_price
        existing.total_price = unit_price * new_qty
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return _serialize_item(db, existing)
    item = CartItem(
        user_id=user_id,
        session_id=session_id if not user_id else None,
        product_id=product.id,
        variant_id=payload.variant_id,
        quantity=payload.quantity,
        unit_price=unit_price,
        total_price=unit_price * payload.quantity,
        notes=payload.notes,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _serialize_item(db, item)

@router.put("/items/{item_id}", response_model=CartItemResponse)
async def update_item(item_id: str, payload: CartItemUpdate, request: Request, db: Session = Depends(get_db_dep), current_user=Depends(optional_auth)):
    user_id = current_user.id if current_user else None
    session_id = _resolve_identity(request, db, user_id)
    q = db.query(CartItem).filter(CartItem.id == item_id)
    q = q.filter(CartItem.user_id == user_id) if user_id else q.filter(CartItem.session_id == session_id)
    item = q.first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if payload.quantity is not None:
        if payload.quantity <= 0:
            db.delete(item)
            db.commit()
            raise HTTPException(status_code=200, detail="Item removed")
        product = db.query(Product).filter(Product.id == item.product_id).first()
        variant = db.query(ProductVariant).filter(ProductVariant.id == item.variant_id).first() if item.variant_id else None
        ensure_stock_available(product, variant, payload.quantity)
        item.quantity = payload.quantity
        item.unit_price = compute_item_price(product, variant)
        item.total_price = item.unit_price * item.quantity
    if payload.notes is not None:
        item.notes = payload.notes
    db.add(item)
    db.commit()
    db.refresh(item)
    return _serialize_item(db, item)

@router.delete("/items/{item_id}")
async def delete_item(item_id: str, request: Request, db: Session = Depends(get_db_dep), current_user=Depends(optional_auth)):
    user_id = current_user.id if current_user else None
    session_id = _resolve_identity(request, db, user_id)
    q = db.query(CartItem).filter(CartItem.id == item_id)
    q = q.filter(CartItem.user_id == user_id) if user_id else q.filter(CartItem.session_id == session_id)
    item = q.first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item removed", "success": True}

@router.delete("/clear")
async def clear_cart(request: Request, db: Session = Depends(get_db_dep), current_user=Depends(optional_auth)):
    user_id = current_user.id if current_user else None
    session_id = _resolve_identity(request, db, user_id)
    q = db.query(CartItem)
    q = q.filter(CartItem.user_id == user_id) if user_id else q.filter(CartItem.session_id == session_id)
    q.delete(synchronize_session=False)
    db.commit()
    return {"message": "Cart cleared", "success": True}

@router.post("/merge")
async def merge_cart(request: Request, db: Session = Depends(get_db_dep), current_user=Depends(get_current_active_user)):
    # merge session cart into user cart
    session_id = request.headers.get(SESSION_HEADER)
    if not session_id:
        return {"message": "No session cart", "success": True}
    session_items = db.query(CartItem).filter(CartItem.session_id == session_id).all()
    for it in session_items:
        existing = db.query(CartItem).filter(CartItem.user_id == current_user.id, CartItem.product_id == it.product_id, CartItem.variant_id == it.variant_id).first()
        if existing:
            existing.quantity += it.quantity
            existing.total_price = existing.unit_price * existing.quantity
            db.add(existing)
            db.delete(it)
        else:
            it.user_id = current_user.id
            it.session_id = None
            db.add(it)
    db.commit()
    return {"message": "Cart merged", "success": True}

@router.get("/validate")
async def validate_cart(request: Request, db: Session = Depends(get_db_dep), current_user=Depends(optional_auth)):
    user_id = current_user.id if current_user else None
    session_id = _resolve_identity(request, db, user_id)
    q = db.query(CartItem)
    q = q.filter(CartItem.user_id == user_id) if user_id else q.filter(CartItem.session_id == session_id)
    items = q.all()
    errors = []
    for it in items:
        product = db.query(Product).filter(Product.id == it.product_id, Product.is_active == True).first()
        if not product:
            errors.append({"item_id": it.id, "error": "Product no longer available"})
            continue
        variant = db.query(ProductVariant).filter(ProductVariant.id == it.variant_id, ProductVariant.product_id == product.id, ProductVariant.is_active == True).first() if it.variant_id else None
        try:
            ensure_stock_available(product, variant, it.quantity)
        except Exception as e:
            errors.append({"item_id": it.id, "error": str(e)})
    return {"valid": len(errors) == 0, "errors": errors}

@router.post("/estimate-shipping")
async def estimate(request: Request, db: Session = Depends(get_db_dep), current_user=Depends(optional_auth)):
    # uses same weight logic as get_cart; for now returns same cost
    user_id = current_user.id if current_user else None
    session_id = _resolve_identity(request, db, user_id)
    q = db.query(CartItem)
    q = q.filter(CartItem.user_id == user_id) if user_id else q.filter(CartItem.session_id == session_id)
    items = q.all()
    weight = 0.0
    for it in items:
        product = db.query(Product).filter(Product.id == it.product_id).first()
        w = float(product.weight) if product and product.weight is not None else 0.2
        weight += w * it.quantity
    shipping = estimate_shipping(weight)
    return {"shipping": shipping}

