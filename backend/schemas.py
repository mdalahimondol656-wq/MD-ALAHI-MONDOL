from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional


# Contact
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str


class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    message: str
    created_at: datetime

    model_config = {"from_attributes": True}


# Profile
class ProfileResponse(BaseModel):
    name: str
    title: str
    tagline: str
    location: str
    bio: str
    skills: list[str]


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    tagline: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[list[str]] = None


# Education
class EducationItem(BaseModel):
    level: str
    institution: str
    period: str
    detail: str
    modules: str


class EducationResponse(BaseModel):
    id: int
    level: str
    institution: str
    period: str
    detail: str
    modules: str
    sort_order: int

    model_config = {"from_attributes": True}


class EducationCreate(BaseModel):
    level: str
    institution: str
    period: str
    detail: str
    modules: str
    sort_order: int = 0


class EducationUpdate(BaseModel):
    level: Optional[str] = None
    institution: Optional[str] = None
    period: Optional[str] = None
    detail: Optional[str] = None
    modules: Optional[str] = None
    sort_order: Optional[int] = None


# Experience
class ExperienceItem(BaseModel):
    role: str
    institution: str
    period: str
    detail: str
    description: str


class ExperienceResponse(BaseModel):
    id: int
    role: str
    institution: str
    period: str
    detail: str
    description: str
    sort_order: int

    model_config = {"from_attributes": True}


class ExperienceCreate(BaseModel):
    role: str
    institution: str
    period: str
    detail: str
    description: str
    sort_order: int = 0


class ExperienceUpdate(BaseModel):
    role: Optional[str] = None
    institution: Optional[str] = None
    period: Optional[str] = None
    detail: Optional[str] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None


# Project/Skill
class ProjectItem(BaseModel):
    title: str
    desc: str


class ProjectGroup(BaseModel):
    category: str
    color: str
    icon: str
    items: list[ProjectItem]


class ProjectGroupResponse(BaseModel):
    id: int
    category: str
    color: str
    icon: str
    sort_order: int

    model_config = {"from_attributes": True}


class ProjectGroupCreate(BaseModel):
    category: str
    color: str
    icon: str
    sort_order: int = 0


class ProjectGroupUpdate(BaseModel):
    category: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    sort_order: Optional[int] = None


class ProjectItemCreate(BaseModel):
    title: str
    desc: str
    group_id: int


class ProjectItemUpdate(BaseModel):
    title: Optional[str] = None
    desc: Optional[str] = None


class ProjectItemResponse(BaseModel):
    id: int
    title: str
    desc: str
    group_id: int

    model_config = {"from_attributes": True}


# Admin Auth
class AdminLogin(BaseModel):
    username: str
    password: str


class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminUserResponse(BaseModel):
    id: int
    username: str
    email: Optional[str]
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class AdminCreate(BaseModel):
    username: str
    password: str
    email: Optional[str] = None