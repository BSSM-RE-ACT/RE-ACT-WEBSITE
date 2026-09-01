from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from .config import settings
from .database import get_db
from .models import AdminAllowedEmail, AdminUser

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


class AdminIdentity:
    def __init__(self, subject: str, is_root: bool, name: str = ""):
        self.subject = subject
        self.is_root = is_root
        self.name = name


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def get_current_admin(
    token: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> AdminIdentity:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="인증이 필요합니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise unauthorized
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        subject = payload.get("sub")
        if not subject:
            raise unauthorized
    except JWTError:
        raise unauthorized

    root = db.query(AdminUser).filter(AdminUser.username == subject).first()
    if root:
        return AdminIdentity(subject=subject, is_root=True, name=root.username)

    allowed = db.query(AdminAllowedEmail).filter(AdminAllowedEmail.email == subject).first()
    if allowed:
        return AdminIdentity(subject=subject, is_root=False, name=allowed.name or allowed.email)

    raise unauthorized


def get_current_root(admin: AdminIdentity = Depends(get_current_admin)) -> AdminIdentity:
    if not admin.is_root:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="root 계정만 할 수 있어요.")
    return admin
