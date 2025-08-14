from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[str] = None
    image_url: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    parent_id: Optional[str] = None
    image_url: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None

class CategoryResponse(CategoryBase):
    id: str
    slug: str
    level: int
    full_path: str
    product_count: int
    children: List["CategoryResponse"] = []
    created_at: datetime | None = None

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True

CategoryResponse.model_rebuild()

class CategoryTreeResponse(BaseModel):
    items: List[CategoryResponse]

class CategoryListResponse(BaseModel):
    items: List[CategoryResponse]
    total: int
    page: int
    limit: int

