import time

from fastapi import APIRouter, HTTPException, Request, status

from ..config import settings
from ..email_utils import send_contact_email
from ..schemas import ContactMessageCreate

router = APIRouter(prefix="/contact", tags=["contact"])

_last_submission_by_ip: dict[str, float] = {}
_COOLDOWN_SECONDS = 30


@router.post("", status_code=204)
def submit_contact(payload: ContactMessageCreate, request: Request):
    if payload.website:
        # honeypot field — bots fill every field, real users never see this one
        return None

    if not settings.smtp_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="문의 메일 발송이 아직 설정되지 않았어요. 관리자에게 문의해 주세요.",
        )

    ip = request.client.host if request.client else "unknown"
    now = time.time()
    last = _last_submission_by_ip.get(ip, 0)
    if now - last < _COOLDOWN_SECONDS:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="잠시 후 다시 시도해 주세요.")
    _last_submission_by_ip[ip] = now

    try:
        send_contact_email(payload.name, payload.email, payload.message)
    except Exception:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="메일 전송에 실패했어요. 잠시 후 다시 시도해 주세요.")

    return None
