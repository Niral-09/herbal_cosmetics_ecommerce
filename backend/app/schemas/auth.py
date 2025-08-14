from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    confirm_password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        password = info.data.get("password")
        if password != v:
            raise ValueError("Passwords do not match")
        return v

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class AdminLoginRequest(UserLoginRequest):
    pass

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8)
    confirm_password: str

    @field_validator("confirm_password")
    @classmethod
    def new_passwords_match(cls, v, info):
        pw = info.data.get("new_password")
        if pw != v:
            raise ValueError("Passwords do not match")
        return v

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class MessageResponse(BaseModel):
    message: str
    success: bool = True

