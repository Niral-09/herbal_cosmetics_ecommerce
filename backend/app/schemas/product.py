from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
from app.models.product import ProductStatus

class ProductImageBase(BaseModel):
    alt_text: Optional[str] = None
    sort_order: int = 0
    image_type: Optional[str] = None

class ProductImageCreate(ProductImageBase):
    image_url: str

class ProductImageUpdate(BaseModel):
    alt_text: Optional[str] = None
    sort_order: Optional[int] = None

class ProductImageResponse(ProductImageBase):
    id: str
    image_url: str
    width: Optional[int] = None
    height: Optional[int] = None
    file_size: Optional[int] = None

    class Config:
        from_attributes = True

class ProductVariantBase(BaseModel):
    title: str
    price: float
    weight: Optional[float] = None
    size: Optional[str] = None
    color: Optional[str] = None
    scent: Optional[str] = None
    inventory_quantity: int = 0
    is_active: bool = True

class ProductVariantCreate(ProductVariantBase):
    sku: Optional[str] = None

class ProductVariantUpdate(BaseModel):
    title: Optional[str] = None
    price: Optional[float] = None
    weight: Optional[float] = None
    size: Optional[str] = None
    color: Optional[str] = None
    scent: Optional[str] = None
    inventory_quantity: Optional[int] = None
    is_active: Optional[bool] = None

class ProductVariantResponse(ProductVariantBase):
    id: str
    sku: Optional[str] = None
    created_at: datetime | None = None

    class Config:
        from_attributes = True

class CategoryAssignment(BaseModel):
    id: str
    is_primary: bool = False

class ProductBase(BaseModel):
    name: str
    sku: Optional[str] = None
    short_description: Optional[str] = None
    detailed_description: Optional[str] = None
    category_id: Optional[str] = None
    brand: Optional[str] = None
    base_price: float
    compare_price: Optional[float] = None
    ingredients: Optional[str] = None
    usage_instructions: Optional[str] = None
    benefits: Optional[str] = None
    skin_type: Optional[list[str]] = None
    hair_type: Optional[list[str]] = None
    track_inventory: bool = True
    inventory_quantity: int = 0
    is_featured: bool = False
    tags: Optional[list[str]] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class ProductCreate(ProductBase):
    categories: Optional[List[CategoryAssignment]] = None
    images: Optional[List[ProductImageCreate]] = None
    variants: Optional[List[ProductVariantCreate]] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    short_description: Optional[str] = None
    detailed_description: Optional[str] = None
    category_id: Optional[str] = None
    categories: Optional[List[CategoryAssignment]] = None
    brand: Optional[str] = None
    base_price: Optional[float] = None
    compare_price: Optional[float] = None
    ingredients: Optional[str] = None
    usage_instructions: Optional[str] = None
    benefits: Optional[str] = None
    skin_type: Optional[list[str]] = None
    hair_type: Optional[list[str]] = None
    track_inventory: Optional[bool] = None
    inventory_quantity: Optional[int] = None
    is_featured: Optional[bool] = None
    tags: Optional[list[str]] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class ProductResponse(ProductBase):
    id: str
    slug: str
    average_rating: float | None = None
    total_reviews: int
    images: List[ProductImageResponse] = []
    variants: List[ProductVariantResponse] = []
    created_at: datetime | None = None

    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int

class ProductSearchResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    suggestions: Optional[List[str]] = None

class ProductInventoryUpdate(BaseModel):
    inventory_quantity: int
    low_stock_threshold: Optional[int] = None

class ProductStatusUpdate(BaseModel):
    is_active: bool
    status: ProductStatus

