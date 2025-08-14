from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timedelta, timezone
from jose import jwt
import hashlib
from app.models.user import User, UserRole
from app.models.refresh_token import RefreshToken
from app.utils.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from app.core.config import settings


def register_user(db: Session, *, email: str, password: str, first_name: str | None = None, last_name: str | None = None, phone: str | None = None) -> User:
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user = User(email=email, hashed_password=get_password_hash(password), first_name=first_name, last_name=last_name, phone=phone)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, *, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")
    return user


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def issue_tokens(db: Session, user: User) -> dict:
    access = create_access_token(user.id)
    refresh = create_refresh_token(user.id)
    # persist refresh token hash
    expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    db.add(RefreshToken(user_id=user.id, token_hash=_hash_token(refresh), expires_at=expires_at))
    db.commit()
    return {"access_token": access, "refresh_token": refresh, "token_type": "bearer"}


def refresh_access_token(db: Session, refresh_token: str) -> dict:
    # verify exists and not expired/revoked
    token_hash = _hash_token(refresh_token)
    rt = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash, RefreshToken.is_revoked == False).first()
    if not rt or rt.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    user = db.query(User).filter(User.id == rt.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    return {"access_token": create_access_token(user.id)}


def revoke_refresh_token(db: Session, refresh_token: str) -> None:
    token_hash = _hash_token(refresh_token)
    rt = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash, RefreshToken.is_revoked == False).first()
    if rt:
        rt.is_revoked = True
        db.add(rt)
        db.commit()

