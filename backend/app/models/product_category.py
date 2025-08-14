from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.sql import func
from app.core.database import Base

class ProductCategory(Base):
    __tablename__ = "product_categories"
    __table_args__ = (
        UniqueConstraint('product_id', 'category_id', name='uq_product_category'),
    )

    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True)
    category_id = Column(String(36), ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True)
    is_primary = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

