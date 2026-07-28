from datetime import datetime
from pydantic import BaseModel, EmailStr


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


class ProfileResponse(BaseModel):
    name: str
    title: str
    tagline: str
    location: str
    bio: str
    skills: list[str]


class ExperienceResponse(BaseModel):
    role: str
    institution: str
    period: str
    detail: str
    description: str


class ProjectResponse(BaseModel):
    title: str
    desc: str
