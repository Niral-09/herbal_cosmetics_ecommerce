from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db_dep, get_current_active_user
from app.schemas.profile import UserResponse, UpdateProfileRequest, ChangePasswordRequest
from app.models.user import User
from app.utils.security import verify_password, get_password_hash

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(payload: UpdateProfileRequest, db: Session = Depends(get_db_dep), current_user: User = Depends(get_current_active_user)):
    if payload.first_name is not None:
        current_user.first_name = payload.first_name
    if payload.last_name is not None:
        current_user.last_name = payload.last_name
    if payload.phone is not None:
        current_user.phone = payload.phone
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/change-password")
def change_password(payload: ChangePasswordRequest, db: Session = Depends(get_db_dep), current_user: User = Depends(get_current_active_user)):
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    if payload.new_password != payload.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")
    current_user.hashed_password = get_password_hash(payload.new_password)
    db.add(current_user)
    db.commit()
    return {"message": "Password updated", "success": True}

