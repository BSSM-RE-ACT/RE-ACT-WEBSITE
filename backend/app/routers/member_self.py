from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Member
from ..schemas import MemberAdminOut, MemberOut, MemberSelfUpdate
from ..security import AdminIdentity, get_current_admin, get_current_member

router = APIRouter(prefix="/members", tags=["members"])


@router.get("/admin", response_model=list[MemberAdminOut], dependencies=[Depends(get_current_admin)])
def list_members_admin(db: Session = Depends(get_db)):
    return db.query(Member).order_by(Member.order, Member.id).all()


@router.get("/me", response_model=MemberOut)
def get_my_member(identity: AdminIdentity = Depends(get_current_member), db: Session = Depends(get_db)):
    item = db.query(Member).filter(Member.id == identity.member_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="부원 정보를 찾을 수 없어요.")
    return item


@router.put("/me", response_model=MemberOut)
def update_my_member(
    payload: MemberSelfUpdate,
    identity: AdminIdentity = Depends(get_current_member),
    db: Session = Depends(get_db),
):
    item = db.query(Member).filter(Member.id == identity.member_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="부원 정보를 찾을 수 없어요.")
    for key, value in payload.model_dump().items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item
