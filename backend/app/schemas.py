from pydantic import BaseModel, ConfigDict


# ---------- auth ----------
class LoginRequest(BaseModel):
    username: str
    password: str


class GoogleLoginRequest(BaseModel):
    credential: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MeOut(BaseModel):
    subject: str
    is_root: bool
    name: str = ""


# ---------- admin allowlist ----------
class AdminAllowedEmailBase(BaseModel):
    email: str
    name: str = ""


class AdminAllowedEmailCreate(AdminAllowedEmailBase):
    pass


class AdminAllowedEmailOut(AdminAllowedEmailBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- visits ----------
class VisitDayCount(BaseModel):
    date: str
    count: int


class VisitStats(BaseModel):
    today: int
    total: int
    daily: list[VisitDayCount]


class VisitSummary(BaseModel):
    total: int


# ---------- site content ----------
class SiteContentBase(BaseModel):
    club_name: str = "RE:ACT"
    tagline: str = ""
    hero_marquee: str = ""

    about_short: str = ""
    about_long: str = ""
    founded_label: str = ""
    stat_extra_label: str = ""
    stat_extra_value: str = ""

    recruit_is_open: bool = True
    recruit_qualification: str = ""
    recruit_how_to_apply: str = ""
    recruit_schedule: str = ""
    recruit_apply_link: str = ""

    contact_email: str = ""
    contact_message: str = ""
    github_url: str = ""
    instagram_url: str = ""


class SiteContentOut(SiteContentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int = 1


class SiteContentUpdate(SiteContentBase):
    pass


# ---------- members ----------
class MemberBase(BaseModel):
    name: str
    role: str = "부원"
    generation: str = ""
    bio: str = ""
    image_url: str = ""
    github_url: str = ""
    order: int = 0


class MemberCreate(MemberBase):
    pass


class MemberOut(MemberBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- projects ----------
class ProjectBase(BaseModel):
    title: str
    description: str = ""
    content: str = ""
    tags: str = ""
    github_url: str = ""
    live_url: str = ""
    image_url: str = ""
    gallery: list[str] = []
    is_featured: bool = False
    order: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectOut(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- skills ----------
class SkillCategoryBase(BaseModel):
    name: str
    items: list[str] = []
    order: int = 0


class SkillCategoryCreate(SkillCategoryBase):
    pass


class SkillCategoryOut(SkillCategoryBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- activities ----------
class ActivityEventBase(BaseModel):
    title: str
    organization: str = ""
    period: str = ""
    role: str = ""
    description: str = ""
    link: str = ""
    order: int = 0


class ActivityEventCreate(ActivityEventBase):
    pass


class ActivityEventOut(ActivityEventBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


# ---------- goals ----------
class GoalItemBase(BaseModel):
    text: str
    done: bool = False
    order: int = 0


class GoalItemCreate(GoalItemBase):
    pass


class GoalItemOut(GoalItemBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class UploadOut(BaseModel):
    url: str
