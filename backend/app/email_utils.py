import smtplib
import ssl
from email.message import EmailMessage

from .config import settings


def send_contact_email(name: str, email: str, message: str) -> None:
    msg = EmailMessage()
    msg["Subject"] = f"[RE:ACT 문의] {name}"
    msg["From"] = settings.smtp_username
    msg["To"] = settings.contact_to
    msg["Reply-To"] = email
    msg.set_content(f"이름: {name}\n이메일: {email}\n\n{message}")

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, context=context) as server:
        server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(msg)
