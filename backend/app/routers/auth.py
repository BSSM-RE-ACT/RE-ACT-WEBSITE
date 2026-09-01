from fastapi import APIRouter, Depends, HTTPException, status
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models import AdminAllowedEmail, AdminUser
from ..schemas import GoogleLoginRequest, LoginRequest, MeOut, Token
from ..security import AdminIdentity, create_access_token, get_current_admin, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.username == payload.username).first()
    if not admin or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="아이디 또는 비밀번호가 올바르지 않습니다.")
    token = create_access_token(subject=admin.username)
    return Token(access_token=token)


@router.post("/google", response_model=Token)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    if not settings.google_client_id:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Google 로그인이 아직 설정되지 않았어요.")

    try:
        idinfo = google_id_token.verify_oauth2_token(
            payload.credential, google_requests.Request(), settings.google_client_id
        )
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="구글 인증에 실패했어요.")

    email = idinfo.get("email")
    if not email or not idinfo.get("email_verified"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="이메일 인증이 확인되지 않았어요.")

    allowed = db.query(AdminAllowedEmail).filter(AdminAllowedEmail.email == email).first()
    if not allowed:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="관리자로 등록되지 않은 구글 계정이에요.")

    token = create_access_token(subject=email)
    return Token(access_token=token)


@router.get("/me", response_model=MeOut)
def me(admin: AdminIdentity = Depends(get_current_admin)):
    return MeOut(subject=admin.subject, is_root=admin.is_root, name=admin.name)
