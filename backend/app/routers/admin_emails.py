from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import AdminAllowedEmail
from ..schemas import AdminAllowedEmailCreate, AdminAllowedEmailOut
from ..security import get_current_admin, get_current_root

router = APIRouter(prefix="/admin-emails", tags=["admin-emails"])


@router.get("", response_model=list[AdminAllowedEmailOut], dependencies=[Depends(get_current_admin)])
def list_admin_emails(db: Session = Depends(get_db)):
    return db.query(AdminAllowedEmail).order_by(AdminAllowedEmail.id).all()


@router.post("", response_model=AdminAllowedEmailOut, dependencies=[Depends(get_current_root)])
def add_admin_email(payload: AdminAllowedEmailCreate, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="이메일을 입력해 주세요.")
    exists = db.query(AdminAllowedEmail).filter(AdminAllowedEmail.email == email).first()
    if exists:
        raise HTTPException(status_code=400, detail="이미 등록된 이메일이에요.")
    item = AdminAllowedEmail(email=email, name=payload.name)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204, dependencies=[Depends(get_current_root)])
def remove_admin_email(item_id: int, db: Session = Depends(get_db)):
    item = db.query(AdminAllowedEmail).filter(AdminAllowedEmail.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="찾을 수 없습니다.")
    db.delete(item)
    db.commit()
    return None
