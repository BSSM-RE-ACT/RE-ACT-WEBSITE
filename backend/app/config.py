import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    secret_key: str = "change-this-secret-key-in-.env"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days

    admin_username: str = "admin"
    admin_password: str = "changeme123"

    google_client_id: str = ""
    admin_emails: str = ""  # comma-separated allowlist seeded on first run

    database_url: str = "sqlite:///./react_club.db"

    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 465
    smtp_username: str = ""
    smtp_password: str = ""
    contact_to_email: str = ""  # where contact-form messages are delivered; defaults to smtp_username

    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    upload_dir: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")

    class Config:
        env_file = ".env"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def admin_emails_list(self) -> list[str]:
        return [e.strip() for e in self.admin_emails.split(",") if e.strip()]

    @property
    def contact_to(self) -> str:
        return self.contact_to_email or self.smtp_username

    @property
    def smtp_configured(self) -> bool:
        return bool(self.smtp_username and self.smtp_password)


settings = Settings()
