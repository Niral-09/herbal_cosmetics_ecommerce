from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey, Text, Numeric, Enum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from uuid import uuid4
from app.utils.helpers import slugify
import enum


def default_uuid() -> str:
    return str(uuid4())

class ProductStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    archived = "archived"

class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=default_uuid, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    sku = Column(String(100), unique=True, nullable=True)

    short_description = Column(Text, nullable=True)
    detailed_description = Column(Text, nullable=True)

    category_id = Column(String(36), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    brand = Column(String(100), nullable=True)

    base_price = Column(Numeric(10, 2), nullable=False)
    compare_price = Column(Numeric(10, 2), nullable=True)
    cost_price = Column(Numeric(10, 2), nullable=True)
    weight = Column(Numeric(10, 2), nullable=True)
    dimensions = Column(JSONB, nullable=True)

    ingredients = Column(Text, nullable=True)
    usage_instructions = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)
    warnings = Column(Text, nullable=True)

    skin_type = Column(JSONB, nullable=True)
    hair_type = Column(JSONB, nullable=True)
    age_group = Column(JSONB, nullable=True)

    track_inventory = Column(Boolean, default=True, nullable=False)
    inventory_quantity = Column(Integer, default=0, nullable=False)
    low_stock_threshold = Column(Integer, default=0, nullable=True)
    continue_selling = Column(Boolean, default=False, nullable=False)
    requires_shipping = Column(Boolean, default=True, nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    status = Column(Enum(ProductStatus), default=ProductStatus.active, nullable=False)

    tags = Column(JSONB, nullable=True)
    meta_title = Column(String(60), nullable=True)
    meta_description = Column(String(160), nullable=True)
    seo_keywords = Column(JSONB, nullable=True)

    average_rating = Column(Numeric(3, 2), default=0, nullable=False)
    total_reviews = Column(Integer, default=0, nullable=False)
    total_sales = Column(Integer, default=0, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category")
    images = relationship("ProductImage", backref="product", cascade="all, delete-orphan")
    variants = relationship("ProductVariant", backref="product", cascade="all, delete-orphan")

    def set_slug(self):
        if not self.slug:
            self.slug = slugify(self.name)

