from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.api.deps import get_db_dep, require_admin_role
from app.schemas.auth import (
    UserRegisterRequest, UserLoginRequest, AdminLoginRequest,
    RefreshTokenRequest, ForgotPasswordRequest, ResetPasswordRequest,
    TokenResponse, MessageResponse,
)
from app.schemas.profile import UserResponse
from app.services.auth_service import (
    register_user, authenticate_user, issue_tokens, refresh_access_token, revoke_refresh_token
)
from app.models.user import UserRole
from app.utils.validators import validate_password_strength
from app.utils.rate_limit import auth_limiter, email_limiter

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse)
def register(payload: UserRegisterRequest, request: Request, db: Session = Depends(get_db_dep)):
    auth_limiter.check(f"register:{request.client.host}")
    validate_password_strength(payload.password)
    user = register_user(
        db,
        email=payload.email,
        password=payload.password,
        first_name=payload.first_name,
        last_name=payload.last_name,
        phone=payload.phone,
    )
    tokens = issue_tokens(db, user)
    return TokenResponse(**tokens, expires_in=1800)

@router.post("/login", response_model=TokenResponse)
def login(payload: UserLoginRequest, request: Request, db: Session = Depends(get_db_dep)):
    auth_limiter.check(f"login:{request.client.host}")
    user = authenticate_user(db, email=payload.email, password=payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    tokens = issue_tokens(db, user)
    return TokenResponse(**tokens, expires_in=1800)

@router.post("/admin/login", response_model=TokenResponse)
def admin_login(payload: AdminLoginRequest, request: Request, db: Session = Depends(get_db_dep)):
    auth_limiter.check(f"admin_login:{request.client.host}")
    user = authenticate_user(db, email=payload.email, password=payload.password)
    if not user or user.role != UserRole.admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin credentials")
    tokens = issue_tokens(db, user)
    return TokenResponse(**tokens, expires_in=1800)

@router.post("/refresh")
def refresh(payload: RefreshTokenRequest, db: Session = Depends(get_db_dep)):
    return refresh_access_token(db, payload.refresh_token)

@router.post("/logout", response_model=MessageResponse)
def logout(payload: RefreshTokenRequest, db: Session = Depends(get_db_dep)):
    revoke_refresh_token(db, payload.refresh_token)
    return MessageResponse(message="Logged out")

@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest, request: Request):
    email_limiter.check(f"forgot:{request.client.host}")
    # TODO: integrate email service & token generation
    return MessageResponse(message="If the email exists, a reset link has been sent")

@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest):
    # TODO: validate token and update password
    return MessageResponse(message="Password has been reset")

