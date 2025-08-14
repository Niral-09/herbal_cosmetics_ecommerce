from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime

class AddressBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company: Optional[str] = None
    address_line_1: Optional[str] = None
    address_line_2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None

class OrderItemPayload(BaseModel):
    product_id: str
    variant_id: Optional[str] = None
    quantity: int

class OrderBase(BaseModel):
    customer_email: EmailStr
    customer_phone: str
    shipping_address: AddressBase
    billing_address: Optional[AddressBase] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemPayload]
    shipping_method: Optional[str] = None
    discount_code: Optional[str] = None

class OrderUpdate(BaseModel):
    shipping_address: Optional[AddressBase] = None
    billing_address: Optional[AddressBase] = None
    notes: Optional[str] = None
    admin_notes: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: str
    reason: Optional[str] = None
    notes: Optional[str] = None

class OrderCancellationRequest(BaseModel):
    reason: Optional[str] = None
    refund_requested: bool = False

class OrderItemResponse(BaseModel):
    id: str
    product_id: Optional[str] = None
    variant_id: Optional[str] = None
    product_name: str
    variant_title: Optional[str] = None
    sku: Optional[str] = None
    quantity: int
    unit_price: float
    total_price: float
    product_image_url: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    order_number: str
    customer_email: str
    customer_phone: str
    status: str
    payment_status: str
    fulfillment_status: str
    currency: str
    subtotal: float
    discount_amount: float
    tax_amount: float
    shipping_amount: float
    total_amount: float
    notes: Optional[str] = None
    admin_notes: Optional[str] = None
    shipping_address: Any | None
    billing_address: Any | None
    shipping_method: Optional[str] = None
    tracking_number: Optional[str] = None
    payment_method: Optional[str] = None
    created_at: datetime | None = None
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class OrderListResponse(BaseModel):
    items: List[OrderResponse]
    total: int
    page: int
    limit: int

