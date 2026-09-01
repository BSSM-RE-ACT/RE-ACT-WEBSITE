from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, JSON

from .database import Base


class AdminUser(Base):
    """The root/bootstrap account, logs in with username+password."""

    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, nullable=False, index=True)
    password_hash = Column(String(128), nullable=False)


class AdminAllowedEmail(Base):
    """Google accounts allowed to log into the admin panel. Managed by root."""

    __tablename__ = "admin_allowed_emails"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(128), default="")


class VisitLog(Base):
    __tablename__ = "visit_logs"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class SiteContent(Base):
    """Singleton row (id=1) holding hero / about / recruit / contact copy."""

    __tablename__ = "site_content"

    id = Column(Integer, primary_key=True, default=1)

    club_name = Column(String(64), default="RE:ACT")
    tagline = Column(String(255), default="부산소프트웨어마이스터고 리액트 개발 동아리")
    hero_marquee = Column(String(255), default="REACT,FRONTEND,TEAM,WEB")

    about_short = Column(String(255), default="Who We Are")
    about_long = Column(Text, default="RE:ACT는 부산소프트웨어마이스터고 리액트 개발 동아리입니다.")
    founded_label = Column(String(64), default="2026.3 ~")
    stat_extra_label = Column(String(64), default="")
    stat_extra_value = Column(String(64), default="")

    recruit_is_open = Column(Boolean, default=True)
    recruit_qualification = Column(Text, default="")
    recruit_how_to_apply = Column(Text, default="")
    recruit_schedule = Column(Text, default="")
    recruit_apply_link = Column(String(255), default="")

    contact_email = Column(String(255), default="")
    contact_message = Column(Text, default="함께 만들어가요.")
    github_url = Column(String(255), default="")
    instagram_url = Column(String(255), default="")


class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), nullable=False)
    role = Column(String(64), default="부원")
    generation = Column(String(32), default="")
    bio = Column(Text, default="")
    image_url = Column(String(255), default="")
    github_url = Column(String(255), default="")
    order = Column(Integer, default=0)


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    description = Column(Text, default="")
    tags = Column(String(255), default="")
    github_url = Column(String(255), default="")
    live_url = Column(String(255), default="")
    image_url = Column(String(255), default="")
    is_featured = Column(Boolean, default=False)
    order = Column(Integer, default=0)


class SkillCategory(Base):
    __tablename__ = "skill_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), nullable=False)
    items = Column(JSON, default=list)
    order = Column(Integer, default=0)


class ActivityEvent(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    organization = Column(String(128), default="")
    period = Column(String(64), default="")
    role = Column(String(64), default="")
    description = Column(Text, default="")
    link = Column(String(255), default="")
    order = Column(Integer, default=0)


class GoalItem(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(255), nullable=False)
    done = Column(Boolean, default=False)
    order = Column(Integer, default=0)
