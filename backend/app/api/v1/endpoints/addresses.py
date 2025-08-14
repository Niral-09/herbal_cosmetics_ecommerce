from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db_dep, get_current_active_user
from app.schemas.address import AddAddressRequest, UpdateAddressRequest, AddressResponse
from app.models.address import Address
from app.models.user import User

router = APIRouter(prefix="/users/addresses", tags=["addresses"])

@router.get("", response_model=List[AddressResponse])
def list_addresses(db: Session = Depends(get_db_dep), current_user: User = Depends(get_current_active_user)):
    return db.query(Address).filter(Address.user_id == current_user.id).order_by(Address.created_at.desc()).all()

@router.post("", response_model=AddressResponse)
def add_address(payload: AddAddressRequest, db: Session = Depends(get_db_dep), current_user: User = Depends(get_current_active_user)):
    addr = Address(user_id=current_user.id, **payload.dict())
    if payload.is_default:
        db.query(Address).filter(Address.user_id == current_user.id, Address.is_default == True).update({Address.is_default: False})
    else:
        # if first address, set default
        exists = db.query(Address).filter(Address.user_id == current_user.id).first()
        if not exists:
            addr.is_default = True
    db.add(addr)
    db.commit()
    db.refresh(addr)
    return addr

@router.put("/{address_id}", response_model=AddressResponse)
def update_address(address_id: str, payload: UpdateAddressRequest, db: Session = Depends(get_db_dep), current_user: User = Depends(get_current_active_user)):
    addr = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not addr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")
    data = payload.dict(exclude_unset=True)
    if data.get("is_default"):
        db.query(Address).filter(Address.user_id == current_user.id, Address.is_default == True).update({Address.is_default: False})
    for k, v in data.items():
        setattr(addr, k, v)
    db.add(addr)
    db.commit()
    db.refresh(addr)
    return addr

@router.delete("/{address_id}")
def delete_address(address_id: str, db: Session = Depends(get_db_dep), current_user: User = Depends(get_current_active_user)):
    addr = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not addr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")
    was_default = addr.is_default
    db.delete(addr)
    db.commit()
    if was_default:
        # set newest as default if exists
        new_default = db.query(Address).filter(Address.user_id == current_user.id).order_by(Address.created_at.desc()).first()
        if new_default:
            new_default.is_default = True
            db.add(new_default)
            db.commit()
    return {"message": "Address deleted", "success": True}

@router.put("/{address_id}/default")
def set_default_address(address_id: str, db: Session = Depends(get_db_dep), current_user: User = Depends(get_current_active_user)):
    addr = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not addr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Address not found")
    db.query(Address).filter(Address.user_id == current_user.id, Address.is_default == True).update({Address.is_default: False})
    addr.is_default = True
    db.add(addr)
    db.commit()
    return {"message": "Default address set", "success": True}

