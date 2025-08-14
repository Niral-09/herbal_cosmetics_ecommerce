from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from uuid import uuid4
from app.utils.helpers import slugify, calc_category_path


def default_uuid() -> str:
    return str(uuid4())

class Category(Base):
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, default=default_uuid, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    parent_id = Column(String(36), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    image_url = Column(String(255), nullable=True)
    meta_title = Column(String(60), nullable=True)
    meta_description = Column(String(160), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)
    level = Column(Integer, default=0, nullable=False)
    full_path = Column(Text, nullable=False)
    product_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    parent = relationship("Category", remote_side=[id], backref="children")

    def set_slug_and_path(self):
        if not self.slug:
            self.slug = slugify(self.name)
        parent_path = self.parent.full_path if self.parent else None
        self.level, self.full_path = calc_category_path(parent_path, self.slug)

