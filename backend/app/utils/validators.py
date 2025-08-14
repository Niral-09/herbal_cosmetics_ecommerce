import re
from fastapi import HTTPException, status

PASSWORD_REGEX = re.compile(r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$")

def validate_password_strength(password: str):
    if not PASSWORD_REGEX.match(password or ""):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must be at least 8 characters and include letters and numbers")

