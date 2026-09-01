from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import SiteContent
from ..schemas import SiteContentOut, SiteContentUpdate
from ..security import get_current_admin

router = APIRouter(prefix="/site-content", tags=["site-content"])


def _get_or_create(db: Session) -> SiteContent:
    content = db.query(SiteContent).filter(SiteContent.id == 1).first()
    if not content:
        content = SiteContent(id=1)
        db.add(content)
        db.commit()
        db.refresh(content)
    return content


@router.get("", response_model=SiteContentOut)
def get_site_content(db: Session = Depends(get_db)):
    return _get_or_create(db)


@router.put("", response_model=SiteContentOut, dependencies=[Depends(get_current_admin)])
def update_site_content(payload: SiteContentUpdate, db: Session = Depends(get_db)):
    content = _get_or_create(db)
    for key, value in payload.model_dump().items():
        setattr(content, key, value)
    db.commit()
    db.refresh(content)
    return content
