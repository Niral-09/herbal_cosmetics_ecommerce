from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.sql import func
from app.core.database import Base
from uuid import uuid4
import enum


def default_uuid() -> str:
    return str(uuid4())

class ImageType(str, enum.Enum):
    main = "main"
    gallery = "gallery"
    thumbnail = "thumbnail"
    variant = "variant"

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(String(36), primary_key=True, default=default_uuid, index=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url = Column(String(255), nullable=False)
    alt_text = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    image_type = Column(Enum(ImageType), default=ImageType.gallery, nullable=False)
    variant_id = Column(String(36), nullable=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    file_size = Column(Integer, nullable=True)
    is_primary = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

