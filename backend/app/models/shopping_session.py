from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class ShoppingSession(Base):
    __tablename__ = "shopping_sessions"

    session_id = Column(String(64), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_accessed = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)
    user_agent = Column(String(255), nullable=True)
    ip_address = Column(String(64), nullable=True)

