from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Numeric, Text, Enum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from uuid import uuid4
import enum


def default_uuid() -> str:
    return str(uuid4())

class OrderStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"
    refunded = "refunded"

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"
    refunded = "refunded"
    partially_refunded = "partially_refunded"

class FulfillmentStatus(str, enum.Enum):
    unfulfilled = "unfulfilled"
    partial = "partial"
    fulfilled = "fulfilled"
    returned = "returned"

class OrderSource(str, enum.Enum):
    web = "web"
    mobile = "mobile"
    admin = "admin"

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=default_uuid, index=True)
    order_number = Column(String(32), unique=True, index=True, nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(32), nullable=False)

    status = Column(Enum(OrderStatus), default=OrderStatus.pending, nullable=False)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.pending, nullable=False)
    fulfillment_status = Column(Enum(FulfillmentStatus), default=FulfillmentStatus.unfulfilled, nullable=False)

    currency = Column(String(8), default="INR", nullable=False)
    subtotal = Column(Numeric(10, 2), default=0, nullable=False)
    discount_amount = Column(Numeric(10, 2), default=0, nullable=False)
    tax_amount = Column(Numeric(10, 2), default=0, nullable=False)
    shipping_amount = Column(Numeric(10, 2), default=0, nullable=False)
    total_amount = Column(Numeric(10, 2), default=0, nullable=False)

    notes = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)

    shipping_address = Column(JSONB, nullable=True)
    billing_address = Column(JSONB, nullable=True)

    shipping_method = Column(String(100), nullable=True)
    tracking_number = Column(String(100), nullable=True)

    gateway_order_id = Column(String(100), nullable=True)
    gateway_payment_id = Column(String(100), nullable=True)
    payment_method = Column(String(32), nullable=True)

    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    cancellation_reason = Column(Text, nullable=True)
    shipped_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)

    source = Column(Enum(OrderSource), default=OrderSource.web, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    items = relationship("OrderItem", backref="order", cascade="all, delete-orphan")
    history = relationship("OrderStatusHistory", backref="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String(36), primary_key=True, default=default_uuid, index=True)
    order_id = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="SET NULL"), nullable=True, index=True)
    variant_id = Column(String(36), ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True, index=True)

    product_name = Column(String(255), nullable=False)
    variant_title = Column(String(100), nullable=True)
    sku = Column(String(100), nullable=True)

    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)

    product_image_url = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"

    id = Column(String(36), primary_key=True, default=default_uuid, index=True)
    order_id = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    previous_status = Column(String(32), nullable=True)
    new_status = Column(String(32), nullable=False)
    changed_by = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    changed_at = Column(DateTime(timezone=True), server_default=func.now())

