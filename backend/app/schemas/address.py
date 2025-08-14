from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.address import AddressType

class AddressBase(BaseModel):
    address_type: AddressType
    full_name: str
    company: Optional[str] = None
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str
    phone: Optional[str] = None

class AddAddressRequest(AddressBase):
    is_default: bool = False

class UpdateAddressRequest(BaseModel):
    address_type: Optional[AddressType] = None
    full_name: Optional[str] = None
    company: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    is_default: Optional[bool] = None

class AddressResponse(AddressBase):
    id: str
    is_default: bool
    created_at: datetime | None = None

    class Config:
        from_attributes = True

