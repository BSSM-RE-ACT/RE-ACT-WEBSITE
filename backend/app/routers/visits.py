from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import VisitLog
from ..schemas import VisitStats, VisitSummary
from ..security import get_current_admin, get_current_root

router = APIRouter(prefix="/visits", tags=["visits"])


@router.post("", status_code=204)
def record_visit(db: Session = Depends(get_db)):
    db.add(VisitLog())
    db.commit()
    return None


@router.get("/summary", response_model=VisitSummary)
def visit_summary(db: Session = Depends(get_db)):
    total = db.query(VisitLog).count()
    return VisitSummary(total=total)


@router.get("/stats", response_model=VisitStats, dependencies=[Depends(get_current_admin)])
def visit_stats(days: int = 30, db: Session = Depends(get_db)):
    days = max(1, min(days, 365))
    today = datetime.utcnow().date()
    since_start = datetime(*(today - timedelta(days=days - 1)).timetuple()[:3])

    rows = (
        db.query(func.date(VisitLog.created_at).label("d"), func.count().label("c"))
        .filter(VisitLog.created_at >= since_start)
        .group_by("d")
        .all()
    )
    counts = {r.d: r.c for r in rows}

    daily = []
    for i in range(days - 1, -1, -1):
        d = today - timedelta(days=i)
        key = d.isoformat()
        daily.append({"date": d.strftime("%m-%d"), "count": counts.get(key, 0)})

    total = db.query(VisitLog).count()
    return VisitStats(today=counts.get(today.isoformat(), 0), total=total, daily=daily)


@router.delete("", status_code=204, dependencies=[Depends(get_current_root)])
def reset_visits(db: Session = Depends(get_db)):
    db.query(VisitLog).delete()
    db.commit()
    return None
