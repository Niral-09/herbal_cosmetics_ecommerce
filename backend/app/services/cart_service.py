from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional, Tuple
from math import ceil
from app.models.cart_item import CartItem
from app.models.shopping_session import ShoppingSession
from app.models.product import Product
from app.models.product_image import ProductImage, ImageType
from app.models.product_variant import ProductVariant

SHIPPING_RATE_PER_KG = 30.0


def get_or_create_session(db: Session, session_id: Optional[str], user_agent: Optional[str], ip: Optional[str]) -> str:
    if session_id:
        sess = db.query(ShoppingSession).filter(ShoppingSession.session_id == session_id).first()
        if sess:
            sess.last_accessed = datetime.utcnow()
            db.add(sess)
            db.commit()
            return session_id
    # create new session
    new_id = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
    sess = ShoppingSession(session_id=new_id, last_accessed=datetime.utcnow(), expires_at=datetime.utcnow()+timedelta(days=7), user_agent=user_agent, ip_address=ip)
    db.add(sess)
    db.commit()
    return new_id


def product_main_image(db: Session, product_id: str) -> Optional[str]:
    img = db.query(ProductImage).filter(ProductImage.product_id == product_id).order_by(ProductImage.is_primary.desc(), ProductImage.sort_order.asc()).first()
    return img.image_url if img else None


def compute_item_price(product: Product, variant: Optional[ProductVariant]) -> float:
    if variant and variant.price is not None:
        return float(variant.price)
    return float(product.base_price)


def ensure_stock_available(product: Product, variant: Optional[ProductVariant], quantity: int):
    if quantity < 1:
        raise ValueError("Quantity must be at least 1")
    # variant-level inventory takes precedence
    if variant:
        if variant.inventory_quantity is not None and variant.inventory_quantity < quantity:
            raise ValueError("Insufficient stock for variant")
    else:
        if product.track_inventory and product.inventory_quantity < quantity:
            raise ValueError("Insufficient stock")


def estimate_shipping(weight_kg: float) -> float:
    if weight_kg <= 0:
        return 0.0
    # anything below 1kg prices as 1kg, and charge per started kg
    billable_kg = max(1, ceil(weight_kg))
    return SHIPPING_RATE_PER_KG * billable_kg


def cart_totals(db: Session, user_id: Optional[str], session_id: Optional[str]) -> Tuple[float, int]:
    q = db.query(CartItem)
    if user_id:
        q = q.filter(CartItem.user_id == user_id)
    else:
        q = q.filter(CartItem.session_id == session_id)
    items = q.all()
    subtotal = sum(float(i.total_price) for i in items)
    total_items = sum(int(i.quantity) for i in items)
    return subtotal, total_items

