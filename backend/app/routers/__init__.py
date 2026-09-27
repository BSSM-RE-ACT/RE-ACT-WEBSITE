from fastapi import APIRouter

from .. import models, schemas
from .factory import make_crud_router
from . import admin_emails, auth, contact, member_self, site_content, uploads, visits

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(site_content.router)
api_router.include_router(uploads.router)
api_router.include_router(admin_emails.router)
api_router.include_router(visits.router)
api_router.include_router(contact.router)

# must be registered before the generic /members/{item_id} route below, so
# "/members/me" and "/members/admin" aren't swallowed as item_id="me"/"admin"
api_router.include_router(member_self.router)

api_router.include_router(
    make_crud_router(
        prefix="/members",
        tag="members",
        model=models.Member,
        create_schema=schemas.MemberCreate,
        out_schema=schemas.MemberOut,
    )
)
api_router.include_router(
    make_crud_router(
        prefix="/projects",
        tag="projects",
        model=models.Project,
        create_schema=schemas.ProjectCreate,
        out_schema=schemas.ProjectOut,
    )
)
api_router.include_router(
    make_crud_router(
        prefix="/skills",
        tag="skills",
        model=models.SkillCategory,
        create_schema=schemas.SkillCategoryCreate,
        out_schema=schemas.SkillCategoryOut,
    )
)
api_router.include_router(
    make_crud_router(
        prefix="/activities",
        tag="activities",
        model=models.ActivityEvent,
        create_schema=schemas.ActivityEventCreate,
        out_schema=schemas.ActivityEventOut,
    )
)
api_router.include_router(
    make_crud_router(
        prefix="/goals",
        tag="goals",
        model=models.GoalItem,
        create_schema=schemas.GoalItemCreate,
        out_schema=schemas.GoalItemOut,
    )
)
