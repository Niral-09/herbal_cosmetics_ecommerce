from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from uuid import uuid4
import enum


def default_uuid() -> str:
    return str(uuid4())


class AddressType(str, enum.Enum):
    shipping = "shipping"
    billing = "billing"


class Address(Base):
    __tablename__ = "addresses"

    id = Column(String(36), primary_key=True, default=default_uuid, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    address_type = Column(Enum(AddressType), default=AddressType.shipping, nullable=False)

    full_name = Column(String(200), nullable=False)
    company = Column(String(200), nullable=True)
    address_line1 = Column(String(255), nullable=False)
    address_line2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    postal_code = Column(String(20), nullable=False)
    country = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    is_default = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="addresses")

