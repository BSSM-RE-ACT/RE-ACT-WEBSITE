from sqlalchemy.orm import Session

from .config import settings
from .models import (
    ActivityEvent,
    AdminAllowedEmail,
    AdminUser,
    GoalItem,
    Member,
    Project,
    SiteContent,
    SkillCategory,
)
from .security import hash_password


def seed_admin(db: Session) -> None:
    exists = db.query(AdminUser).filter(AdminUser.username == settings.admin_username).first()
    if not exists:
        db.add(
            AdminUser(
                username=settings.admin_username,
                password_hash=hash_password(settings.admin_password),
            )
        )
        db.commit()


def seed_admin_emails(db: Session) -> None:
    for email in settings.admin_emails_list:
        exists = db.query(AdminAllowedEmail).filter(AdminAllowedEmail.email == email).first()
        if not exists:
            db.add(AdminAllowedEmail(email=email))
    db.commit()


def seed_content(db: Session) -> None:
    if not db.query(SiteContent).filter(SiteContent.id == 1).first():
        db.add(
            SiteContent(
                id=1,
                club_name="RE:ACT",
                tagline="부산소프트웨어마이스터고 리액트 개발 동아리",
                hero_marquee="REACT,FRONTEND,TEAM,WEB",
                about_short="Who We Are",
                about_long=(
                    "RE:ACT는 부산소프트웨어마이스터고 학생들이 모여 리액트와 "
                    "웹 개발을 함께 공부하고, 실제로 쓰이는 프로젝트를 만드는 개발 동아리입니다."
                ),
                founded_label="2026.3 ~",
                stat_extra_label="스터디",
                stat_extra_value="1+",
                recruit_is_open=True,
                recruit_qualification="부산소프트웨어마이스터고 재학생 누구나 지원 가능합니다.",
                recruit_how_to_apply="아래 지원 링크를 통해 지원서를 작성해 주세요.",
                recruit_schedule="모집 일정은 추후 공지됩니다.",
                recruit_apply_link="",
                contact_email="",
                contact_message="함께 만들어가요.",
                github_url="",
                instagram_url="",
            )
        )
        db.commit()


def seed_members(db: Session) -> None:
    if db.query(Member).count() == 0:
        db.add_all(
            [
                Member(
                    name="임제민",
                    role="동아리장",
                    generation="6기",
                    bio="RE:ACT를 만든 동아리장입니다.",
                    order=0,
                ),
            ]
        )
        db.commit()


def seed_projects(db: Session) -> None:
    if db.query(Project).count() == 0:
        db.add_all(
            [
                Project(
                    title="RE:ACT 동아리 웹사이트",
                    description="RE:ACT 동아리를 소개하는 공식 웹사이트입니다.",
                    tags="React,TypeScript,FastAPI,Tailwind",
                    is_featured=True,
                    order=0,
                ),
            ]
        )
        db.commit()


def seed_skills(db: Session) -> None:
    if db.query(SkillCategory).count() == 0:
        db.add_all(
            [
                SkillCategory(name="FRONTEND", items=["React", "TypeScript", "Tailwind CSS"], order=0),
                SkillCategory(name="BACKEND", items=["FastAPI", "Node.js"], order=1),
                SkillCategory(name="TOOLS", items=["Git", "Figma", "VS Code"], order=2),
            ]
        )
        db.commit()


def seed_activities(db: Session) -> None:
    if db.query(ActivityEvent).count() == 0:
        db.add_all(
            [
                ActivityEvent(
                    title="RE:ACT 창설",
                    organization="부산소프트웨어마이스터고",
                    period="2026.3 ~",
                    role="동아리장",
                    description="RE:ACT 동아리를 창설했습니다.",
                    order=0,
                ),
            ]
        )
        db.commit()


def seed_goals(db: Session) -> None:
    if db.query(GoalItem).count() == 0:
        db.add_all(
            [
                GoalItem(text="동아리 정기 스터디 운영하기", done=False, order=0),
                GoalItem(text="교외 대회 1개 이상 참가하기", done=False, order=1),
            ]
        )
        db.commit()


def run_seed(db: Session) -> None:
    seed_admin(db)
    seed_admin_emails(db)
    seed_content(db)
    seed_members(db)
    seed_projects(db)
    seed_skills(db)
    seed_activities(db)
    seed_goals(db)
