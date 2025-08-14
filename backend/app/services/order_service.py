from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from app.models.order import Order, OrderItem, OrderStatus, OrderStatusHistory
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.product_variant import ProductVariant


def generate_order_number(db: Session) -> str:
    today = datetime.utcnow().strftime("%Y%m%d")
    # count today's orders for suffix; simple approach
    prefix = f"HC-{today}-"
    count = db.query(Order).filter(Order.order_number.like(f"{prefix}%")).count() + 1
    return f"{prefix}{count:04d}"


def capture_item_snapshot(db: Session, product_id: str, variant_id: Optional[str], quantity: int) -> OrderItem:
    product = db.query(Product).filter(Product.id == product_id).first()
    variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id, ProductVariant.product_id == product_id).first() if variant_id else None
    name = product.name if product else ""
    vtitle = variant.title if variant else None
    sku = variant.sku if variant else (product.sku if hasattr(product, 'sku') else None)
    unit_price = float(variant.price if variant and variant.price is not None else product.base_price)
    image = db.query(ProductImage).filter(ProductImage.product_id == product_id).order_by(ProductImage.is_primary.desc(), ProductImage.sort_order.asc()).first()
    return OrderItem(
        product_id=product_id,
        variant_id=variant_id,
        product_name=name,
        variant_title=vtitle,
        sku=sku,
        quantity=quantity,
        unit_price=unit_price,
        total_price=unit_price * quantity,
        product_image_url=image.image_url if image else None,
    )


def adjust_inventory_on_create(db: Session, items: List[OrderItem]):
    for it in items:
        if it.variant_id:
            v = db.query(ProductVariant).filter(ProductVariant.id == it.variant_id).first()
            if v and v.inventory_quantity is not None:
                v.inventory_quantity = max(0, v.inventory_quantity - it.quantity)
                db.add(v)
        else:
            p = db.query(Product).filter(Product.id == it.product_id).first()
            if p and p.track_inventory:
                p.inventory_quantity = max(0, p.inventory_quantity - it.quantity)
                db.add(p)


def release_inventory_on_cancel(db: Session, items: List[OrderItem]):
    for it in items:
        if it.variant_id:
            v = db.query(ProductVariant).filter(ProductVariant.id == it.variant_id).first()
            if v and v.inventory_quantity is not None:
                v.inventory_quantity += it.quantity
                db.add(v)
        else:
            p = db.query(Product).filter(Product.id == it.product_id).first()
            if p and p.track_inventory:
                p.inventory_quantity += it.quantity
                db.add(p)


def add_status_history(db: Session, order: Order, new_status: OrderStatus, reason: Optional[str] = None, notes: Optional[str] = None, changed_by: Optional[str] = None):
    hist = OrderStatusHistory(order_id=order.id, previous_status=order.status.value, new_status=new_status.value, reason=reason, notes=notes, changed_by=changed_by)
    order.status = new_status
    db.add(hist)
    db.add(order)

