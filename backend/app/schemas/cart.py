from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CartItemBase(BaseModel):
    product_id: str
    variant_id: Optional[str] = None
    quantity: int = 1
    notes: Optional[str] = None

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: Optional[int] = None
    notes: Optional[str] = None

class CartItemResponse(BaseModel):
    id: str
    product_id: str
    variant_id: Optional[str] = None
    product_name: str
    variant_title: Optional[str] = None
    product_image: Optional[str] = None
    quantity: int
    unit_price: float
    total_price: float
    created_at: datetime | None = None

class CartSummary(BaseModel):
    items: List[CartItemResponse]
    subtotal: float
    total_items: int
    estimated_tax: float
    estimated_shipping: float
    estimated_total: float

class AddToCartRequest(CartItemBase):
    pass

