from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean, Text, Numeric
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from app.core.database import Base
from uuid import uuid4


def default_uuid() -> str:
    return str(uuid4())

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(String(36), primary_key=True, default=default_uuid, index=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(100), nullable=False)
    sku = Column(String(100), unique=True, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    compare_price = Column(Numeric(10, 2), nullable=True)
    cost_price = Column(Numeric(10, 2), nullable=True)
    weight = Column(Numeric(10, 2), nullable=True)
    dimensions = Column(JSONB, nullable=True)
    inventory_quantity = Column(Integer, default=0, nullable=False)
    low_stock_threshold = Column(Integer, default=0, nullable=True)
    size = Column(String(50), nullable=True)
    color = Column(String(50), nullable=True)
    scent = Column(String(50), nullable=True)
    barcode = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

