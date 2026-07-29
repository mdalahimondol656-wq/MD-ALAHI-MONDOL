import jwt
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import hashlib
import secrets

from database import Base, engine, get_db
from models import ContactMessage, AdminUser, Education, Experience, ProjectGroup, ProjectItem, WebsiteContent
from schemas import (
    ContactCreate, ContactResponse,
    ProfileUpdate,
    EducationCreate, EducationUpdate, EducationResponse,
    ExperienceCreate, ExperienceUpdate, ExperienceResponse,
    ProjectGroupCreate, ProjectGroupUpdate, ProjectGroupResponse,
    ProjectItemCreate, ProjectItemUpdate, ProjectItemResponse,
    AdminLogin, AdminToken, AdminUserResponse, AdminCreate,
    WebsiteContentCreate, WebsiteContentUpdate, WebsiteContentResponse
)

security = HTTPBearer()

SECRET_KEY = "cv-portfolio-admin-secret-key-change-in-production-2024"
ALGORITHM = "HS256"
SESSION_DURATION_MINUTES = 720


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def create_token(username: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=SESSION_DURATION_MINUTES)
    payload = {"sub": username, "exp": expire, "iat": datetime.now(timezone.utc)}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    username = verify_token(credentials.credentials)
    user = db.query(AdminUser).filter(AdminUser.username == username).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin not found or inactive")
    return user


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        if not db.query(AdminUser).first():
            admin = AdminUser(
                username="admin",
                password_hash=hash_password("admin123"),
                email="admin@example.com",
                is_active=True
            )
            db.add(admin)
            db.commit()

        if db.query(Education).count() == 0:
            edu_data = [
                {"level": "Master of Science (M.Sc.) in Psychology", "institution": "University of Dhaka (Affiliated Dhaka College)", "period": "2022 - 2023", "detail": "Graduated March 2025 | Final CGPA: 3.10 / 4.00", "modules": "Clinical & Counseling Psychology, Industrial-Organizational Psychology, Environmental Psychology, Child Development & Disabilities, Advanced Social Psychology, School Psychology", "sort_order": 0},
                {"level": "Bachelor of Science (B.Sc. Honours) in Psychology", "institution": "University of Dhaka (Affiliated Dhaka College)", "period": "2018 - 2019", "detail": "Graduated May 2024 | Final CGPA: 2.96 / 4.00 (4th Year GPA: 2.93)", "modules": "Positive Psychology, Personality Psychology, Theories of Learning, History & Systems in Psychology, Cognitive Psychology, Educational Psychology", "sort_order": 1},
                {"level": "Higher Secondary Certificate (HSC)", "institution": "Lalmonirhat Govt. College, Lalmonirhat", "period": "2016 - 2018", "detail": "Board: Dinajpur | Group: Humanities | GPA: 3.50 / 5.00", "modules": "", "sort_order": 2},
                {"level": "Secondary School Certificate (SSC)", "institution": "Phulkha Adarsha High School, Kurigram", "period": "2014 - 2016", "detail": "Board: Dinajpur | Group: Science | GPA: 4.00 / 5.00", "modules": "", "sort_order": 3},
            ]
            for d in edu_data:
                db.add(Education(**d))
            db.commit()

        if db.query(Experience).count() == 0:
            exp_data = [
                {"role": "Graduate Intern in Psychology Department", "institution": "University of Dhaka", "period": "M.Sc. Requirement", "detail": "Grade: A (Excellent) | Grade Point: 3.75", "description": "Applied theoretical psychological frameworks in active field settings, managed case data, and observed practical behavioral interventions.", "sort_order": 0},
                {"role": "Independent Research Project", "institution": "University of Dhaka", "period": "Academic Project", "detail": "Grade: A+ (Outstanding) | Grade Point: 4.00", "description": "Formulated research methodologies, compiled field data, performed analytical reviews on behavioral subsets, and defended project findings before the academic board.", "sort_order": 1},
            ]
            for d in exp_data:
                db.add(Experience(**d))
            db.commit()

        if db.query(ProjectGroup).count() == 0:
            grp_data = [
                {"category": "Clinical & Counseling", "color": "cyan", "icon": "Star", "sort_order": 0},
                {"category": "Research & Analytics", "color": "blue", "icon": "Briefcase", "sort_order": 1},
                {"category": "Corporate & Social", "color": "teal", "icon": "Folder", "sort_order": 2},
            ]
            for d in grp_data:
                db.add(ProjectGroup(**d))
            db.commit()
            db.refresh(db.query(ProjectGroup).order_by(ProjectGroup.sort_order).all())

        if db.query(ProjectItem).count() == 0:
            groups = db.query(ProjectGroup).order_by(ProjectGroup.sort_order).all()
            group_ids = [g.id for g in groups]
            items = [
                {"title": "Counseling Frameworks", "desc": "Applied structured counseling approaches in field settings with case documentation and behavioral tracking.", "group_id": group_ids[0]},
                {"title": "Behavioral Analysis", "desc": "Observed and documented behavioral patterns across diverse populations using standardized assessment tools.", "group_id": group_ids[0]},
                {"title": "Child Development Assessment", "desc": "Evaluated developmental milestones and learning behaviors in educational settings.", "group_id": group_ids[0]},
                {"title": "Field Data Collection", "desc": "Designed and executed data collection protocols for psychological studies with rigorous methodology.", "group_id": group_ids[1]},
                {"title": "Psychological Project Design", "desc": "Formulated research methodologies, compiled field data, and performed analytical reviews on behavioral subsets.", "group_id": group_ids[1]},
                {"title": "Academic Reporting", "desc": "Produced structured academic reports with evidence-based findings and recommendations.", "group_id": group_ids[1]},
                {"title": "Industrial-Organizational Psychology", "desc": "Applied organizational behavior principles to workplace dynamics and team performance analysis.", "group_id": group_ids[2]},
                {"title": "Positive Psychology Frameworks", "desc": "Utilized strengths-based approaches to promote well-being and resilience in organizational settings.", "group_id": group_ids[2]},
                {"title": "Social Psychology Dynamics", "desc": "Analyzed group behavior, social influence, and interpersonal dynamics in structured environments.", "group_id": group_ids[2]},
            ]
            for d in items:
                db.add(ProjectItem(**d))
            db.commit()

        if db.query(WebsiteContent).count() == 0:
            content = [
                # Profile
                {"section": "profile", "key": "name", "value": "MD ALAHI MONDOL", "sort_order": 0},
                {"section": "profile", "key": "title", "value": "Graduate Psychologist / Research Consultant", "sort_order": 1},
                {"section": "profile", "key": "tagline", "value": "Bridging academic excellence in Psychology with data-driven behavioral insights.", "sort_order": 2},
                {"section": "profile", "key": "location", "value": "Kurigram / Dhaka, Bangladesh", "sort_order": 3},
                {"section": "profile", "key": "bio", "value": "Analytical and dedicated Psychology graduate with a comprehensive academic background spanning a Master of Science (M.Sc.) and a Bachelor of Science (B.Sc. Honours) from the University of Dhaka (Dhaka College). Equipped with a robust understanding of human behavior, clinical counseling frameworks, organizational dynamics, and environmental psychology. Proven capability in structured academic environments, backed by hands-on internship experience and structured project execution. Ready to leverage strong research methodology, data evaluation, and behavioral analysis skills to drive impactful solutions in psychological research, counseling, or human resources.", "sort_order": 4},
                {"section": "profile", "key": "badge", "value": "Available for Opportunities", "sort_order": 5},
                # Skills
                {"section": "skills", "key": "skill", "value": "Clinical Psychology", "sort_order": 0},
                {"section": "skills", "key": "skill", "value": "Counseling Frameworks", "sort_order": 1},
                {"section": "skills", "key": "skill", "value": "Behavioral Analysis", "sort_order": 2},
                {"section": "skills", "key": "skill", "value": "Industrial-Organizational Psychology", "sort_order": 3},
                {"section": "skills", "key": "skill", "value": "Environmental Psychology", "sort_order": 4},
                {"section": "skills", "key": "skill", "value": "Child Development Assessment", "sort_order": 5},
                {"section": "skills", "key": "skill", "value": "Educational Psychology", "sort_order": 6},
                {"section": "skills", "key": "skill", "value": "Positive Psychology", "sort_order": 7},
                {"section": "skills", "key": "skill", "value": "Social Psychology", "sort_order": 8},
                {"section": "skills", "key": "skill", "value": "Cognitive Psychology", "sort_order": 9},
                {"section": "skills", "key": "skill", "value": "Field Data Collection", "sort_order": 10},
                {"section": "skills", "key": "skill", "value": "Research Methodology", "sort_order": 11},
                {"section": "skills", "key": "skill", "value": "Case Studies", "sort_order": 12},
                {"section": "skills", "key": "skill", "value": "Academic Reporting", "sort_order": 13},
                {"section": "skills", "key": "skill", "value": "Active Listening", "sort_order": 14},
                {"section": "skills", "key": "skill", "value": "Empathy", "sort_order": 15},
                # Stats
                {"section": "stats", "key": "label_1", "value": "CGPA", "sort_order": 0},
                {"section": "stats", "key": "value_1", "value": "3.10", "sort_order": 1},
                {"section": "stats", "key": "suffix_1", "value": "/4.00", "sort_order": 2},
                {"section": "stats", "key": "icon_1", "value": "GraduationCap", "sort_order": 3},
                {"section": "stats", "key": "color_1", "value": "cyan", "sort_order": 4},
                {"section": "stats", "key": "label_2", "value": "Experience", "sort_order": 5},
                {"section": "stats", "key": "value_2", "value": "2", "sort_order": 6},
                {"section": "stats", "key": "suffix_2", "value": "+ Years", "sort_order": 7},
                {"section": "stats", "key": "icon_2", "value": "Briefcase", "sort_order": 8},
                {"section": "stats", "key": "color_2", "value": "blue", "sort_order": 9},
                {"section": "stats", "key": "label_3", "value": "Projects", "sort_order": 10},
                {"section": "stats", "key": "value_3", "value": "10", "sort_order": 11},
                {"section": "stats", "key": "suffix_3", "value": "+", "sort_order": 12},
                {"section": "stats", "key": "icon_3", "value": "Award", "sort_order": 13},
                {"section": "stats", "key": "color_3", "value": "teal", "sort_order": 14},
                {"section": "stats", "key": "label_4", "value": "Skills", "sort_order": 15},
                {"section": "stats", "key": "value_4", "value": "15", "sort_order": 16},
                {"section": "stats", "key": "suffix_4", "value": "+", "sort_order": 17},
                {"section": "stats", "key": "icon_4", "value": "TrendingUp", "sort_order": 18},
                {"section": "stats", "key": "color_4", "value": "cyan", "sort_order": 19},
                # Contact info
                {"section": "contact", "key": "phone_1", "value": "01770 340 226", "sort_order": 0},
                {"section": "contact", "key": "phone_2", "value": "0151 895 1529", "sort_order": 1},
                {"section": "contact", "key": "email_1", "value": "mondolmdalahe1880@gmail.com", "sort_order": 2},
                {"section": "contact", "key": "email_2", "value": "dwlaha9@gmail.com", "sort_order": 3},
                {"section": "contact", "key": "dob", "value": "November 02, 1999", "sort_order": 4},
                {"section": "contact", "key": "nationality", "value": "Bangladeshi", "sort_order": 5},
                # Social links
                {"section": "social", "key": "instagram", "value": "https://www.instagram.com/mdalahimondol", "sort_order": 0},
                {"section": "social", "key": "linkedin", "value": "https://www.linkedin.com/in/md-alahi-914b13285", "sort_order": 1},
                {"section": "social", "key": "github", "value": "https://github.com/mdalahimondol", "sort_order": 2},
                {"section": "social", "key": "email", "value": "mailto:mondolmdalahe1880@gmail.com", "sort_order": 3},
            ]
            for d in content:
                db.add(WebsiteContent(**d))
            db.commit()
    finally:
        db.close()
    yield


app = FastAPI(title="MD ALAHI MONDOL — CV Portfolio API", version="2.1.0", lifespan=lifespan)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "version": "2.1.0", "routes": [r.path for r in app.routes if hasattr(r, "path")]}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://your-vercel-app.vercel.app", "https://md-alahi-mondol.vercel.app", "https://mdalahimondol656-2022.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Public Endpoints ────────────────────────────────────────────

@app.get("/api/profile")
def get_profile(db: Session = Depends(get_db)):
    items = db.query(WebsiteContent).filter(WebsiteContent.section == "profile").all()
    data = {item.key: item.value for item in items}
    skills_raw = db.query(WebsiteContent).filter(WebsiteContent.section == "skills").order_by(WebsiteContent.sort_order).all()
    skills = [s.value for s in skills_raw]
    return {
        "name": data.get("name", "MD ALAHI MONDOL"),
        "title": data.get("title", "Graduate Psychologist / Research Consultant"),
        "tagline": data.get("tagline", "Bridging academic excellence in Psychology with data-driven behavioral insights."),
        "location": data.get("location", "Kurigram / Dhaka, Bangladesh"),
        "bio": data.get("bio", "Analytical and dedicated Psychology graduate..."),
        "skills": skills,
    }


@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    items = db.query(WebsiteContent).filter(WebsiteContent.section == "stats").order_by(WebsiteContent.sort_order).all()
    data = {item.key: item.value for item in items}
    return [
        {"label": data.get("label_1", "CGPA"), "value": float(data.get("value_1", "3.10")), "suffix": data.get("suffix_1", "/4.00"), "icon": data.get("icon_1", "GraduationCap"), "color": data.get("color_1", "cyan")},
        {"label": data.get("label_2", "Experience"), "value": int(data.get("value_2", "2")), "suffix": data.get("suffix_2", "+ Years"), "icon": data.get("icon_2", "Briefcase"), "color": data.get("color_2", "blue")},
        {"label": data.get("label_3", "Projects"), "value": int(data.get("value_3", "10")), "suffix": data.get("suffix_3", "+"), "icon": data.get("icon_3", "Award"), "color": data.get("color_3", "teal")},
        {"label": data.get("label_4", "Skills"), "value": int(data.get("value_4", "15")), "suffix": data.get("suffix_4", "+"), "icon": data.get("icon_4", "TrendingUp"), "color": data.get("color_4", "cyan")},
    ]


@app.get("/api/contact-info")
def get_contact_info(db: Session = Depends(get_db)):
    items = db.query(WebsiteContent).filter(WebsiteContent.section == "contact").order_by(WebsiteContent.sort_order).all()
    data = {item.key: item.value for item in items}
    socials = db.query(WebsiteContent).filter(WebsiteContent.section == "social").order_by(WebsiteContent.sort_order).all()
    social_data = {s.key: s.value for s in socials}
    return {
        "phones": [data.get("phone_1", "01770 340 226"), data.get("phone_2", "0151 895 1529")],
        "emails": [data.get("email_1", "mondolmdalahe1880@gmail.com"), data.get("email_2", "dwlaha9@gmail.com")],
        "dob": data.get("dob", "November 02, 1999"),
        "nationality": data.get("nationality", "Bangladeshi"),
        "socials": {
            "instagram": social_data.get("instagram", "https://www.instagram.com/mdalahimondol"),
            "linkedin": social_data.get("linkedin", "https://www.linkedin.com/in/md-alahi-914b13285"),
            "github": social_data.get("github", "https://github.com/mdalahimondol"),
            "email": social_data.get("email", "mailto:mondolmdalahe1880@gmail.com"),
        },
    }


@app.get("/api/education")
def get_education(db: Session = Depends(get_db)):
    items = db.query(Education).order_by(Education.sort_order).all()
    return items


@app.get("/api/experiences")
def get_experiences(db: Session = Depends(get_db)):
    items = db.query(Experience).order_by(Experience.sort_order).all()
    return items


@app.get("/api/projects")
def get_projects(db: Session = Depends(get_db)):
    groups = db.query(ProjectGroup).order_by(ProjectGroup.sort_order).all()
    result = {}
    for group in groups:
        items = db.query(ProjectItem).filter(ProjectItem.group_id == group.id).all()
        result[group.category] = [{"id": item.id, "title": item.title, "desc": item.desc} for item in items]
    return result


@app.post("/api/contact", response_model=ContactResponse)
def create_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    msg = ContactMessage(**payload.model_dump())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


# ─── Admin Authentication ────────────────────────────────────────

@app.post("/api/admin/login", response_model=AdminToken)
def admin_login(payload: AdminLogin, db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(AdminUser.username == payload.username).first()
    if not user or not user.verify_password(payload.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_token(user.username)
    return AdminToken(access_token=token)


@app.post("/api/admin/logout")
def admin_logout():
    return {"message": "Logged out"}


@app.get("/api/admin/me", response_model=AdminUserResponse)
def get_current_admin_info(current_admin: AdminUser = Depends(get_current_admin)):
    return current_admin


# ─── Admin Profile Management ────────────────────────────────────

@app.put("/api/admin/profile")
def update_profile(profile: ProfileUpdate, current_admin: AdminUser = Depends(get_current_admin)):
    return {"message": "Profile updated", "data": profile.model_dump(exclude_none=True)}


# ─── Admin Education CRUD ────────────────────────────────────────

@app.get("/api/admin/education", response_model=list[EducationResponse])
def list_education(current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import Education
    items = db.query(Education).order_by(Education.sort_order).all()
    return items


@app.post("/api/admin/education", response_model=EducationResponse)
def create_education(item: EducationCreate, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import Education
    edu = Education(**item.model_dump())
    db.add(edu)
    db.commit()
    db.refresh(edu)
    return edu


@app.put("/api/admin/education/{edu_id}", response_model=EducationResponse)
def update_education(edu_id: int, item: EducationUpdate, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import Education
    edu = db.query(Education).filter(Education.id == edu_id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education not found")
    for key, value in item.model_dump(exclude_none=True).items():
        setattr(edu, key, value)
    db.commit()
    db.refresh(edu)
    return edu


@app.delete("/api/admin/education/{edu_id}")
def delete_education(edu_id: int, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import Education
    edu = db.query(Education).filter(Education.id == edu_id).first()
    if not edu:
        raise HTTPException(status_code=404, detail="Education not found")
    db.delete(edu)
    db.commit()
    return {"message": "Deleted"}


# ─── Admin Experience CRUD ───────────────────────────────────────

@app.get("/api/admin/experiences", response_model=list[ExperienceResponse])
def list_experiences(current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import Experience
    items = db.query(Experience).order_by(Experience.sort_order).all()
    return items


@app.post("/api/admin/experiences", response_model=ExperienceResponse)
def create_experience(item: ExperienceCreate, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import Experience
    exp = Experience(**item.model_dump())
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp


@app.put("/api/admin/experiences/{exp_id}", response_model=ExperienceResponse)
def update_experience(exp_id: int, item: ExperienceUpdate, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import Experience
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    for key, value in item.model_dump(exclude_none=True).items():
        setattr(exp, key, value)
    db.commit()
    db.refresh(exp)
    return exp


@app.delete("/api/admin/experiences/{exp_id}")
def delete_experience(exp_id: int, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import Experience
    exp = db.query(Experience).filter(Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(exp)
    db.commit()
    return {"message": "Deleted"}


# ─── Admin Projects CRUD ─────────────────────────────────────────

@app.get("/api/admin/projects", response_model=list[ProjectGroupResponse])
def list_project_groups(current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import ProjectGroup
    items = db.query(ProjectGroup).order_by(ProjectGroup.sort_order).all()
    return items


@app.post("/api/admin/projects", response_model=ProjectGroupResponse)
def create_project_group(item: ProjectGroupCreate, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import ProjectGroup
    group = ProjectGroup(**item.model_dump())
    db.add(group)
    db.commit()
    db.refresh(group)
    return group


@app.put("/api/admin/projects/{group_id}", response_model=ProjectGroupResponse)
def update_project_group(group_id: int, item: ProjectGroupUpdate, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import ProjectGroup
    group = db.query(ProjectGroup).filter(ProjectGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Project group not found")
    for key, value in item.model_dump(exclude_none=True).items():
        setattr(group, key, value)
    db.commit()
    db.refresh(group)
    return group


@app.delete("/api/admin/projects/{group_id}")
def delete_project_group(group_id: int, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import ProjectGroup
    group = db.query(ProjectGroup).filter(ProjectGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Project group not found")
    db.delete(group)
    db.commit()
    return {"message": "Deleted"}


@app.get("/api/admin/projects/{group_id}/items", response_model=list[ProjectItemResponse])
def list_project_items(group_id: int, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import ProjectItem
    items = db.query(ProjectItem).filter(ProjectItem.group_id == group_id).all()
    return items


@app.post("/api/admin/projects/{group_id}/items", response_model=ProjectItemResponse)
def create_project_item(group_id: int, item: ProjectItemCreate, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import ProjectItem
    proj = ProjectItem(**item.model_dump())
    db.add(proj)
    db.commit()
    db.refresh(proj)
    return proj


@app.put("/api/admin/projects/items/{item_id}", response_model=ProjectItemResponse)
def update_project_item(item_id: int, item: ProjectItemUpdate, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import ProjectItem
    proj = db.query(ProjectItem).filter(ProjectItem.id == item_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project item not found")
    for key, value in item.model_dump(exclude_none=True).items():
        setattr(proj, key, value)
    db.commit()
    db.refresh(proj)
    return proj


@app.delete("/api/admin/projects/items/{item_id}")
def delete_project_item(item_id: int, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    from models import ProjectItem
    proj = db.query(ProjectItem).filter(ProjectItem.id == item_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project item not found")
    db.delete(proj)
    db.commit()
    return {"message": "Deleted"}


# ─── Admin Contact Messages ──────────────────────────────────────

@app.get("/api/admin/contacts", response_model=list[ContactResponse])
def list_contacts(current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return messages


@app.delete("/api/admin/contacts/{contact_id}")
def delete_contact(contact_id: int, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == contact_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(msg)
    db.commit()
    return {"message": "Deleted"}


# ─── Admin Website Content CRUD ──────────────────────────────────

@app.get("/api/admin/content", response_model=list[WebsiteContentResponse])
def list_content(section: str = None, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    q = db.query(WebsiteContent)
    if section:
        q = q.filter(WebsiteContent.section == section)
    return q.order_by(WebsiteContent.section, WebsiteContent.sort_order).all()


@app.post("/api/admin/content", response_model=WebsiteContentResponse)
def create_content(item: WebsiteContentCreate, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    content = WebsiteContent(**item.model_dump())
    db.add(content)
    db.commit()
    db.refresh(content)
    return content


@app.put("/api/admin/content/{content_id}", response_model=WebsiteContentResponse)
def update_content(content_id: int, item: WebsiteContentUpdate, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    content = db.query(WebsiteContent).filter(WebsiteContent.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    for key, value in item.model_dump(exclude_none=True).items():
        setattr(content, key, value)
    db.commit()
    db.refresh(content)
    return content


@app.delete("/api/admin/content/{content_id}")
def delete_content(content_id: int, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    content = db.query(WebsiteContent).filter(WebsiteContent.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    db.delete(content)
    db.commit()
    return {"message": "Deleted"}


@app.get("/api/admin/content/{section}")
def get_section_content(section: str, current_admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    items = db.query(WebsiteContent).filter(WebsiteContent.section == section).order_by(WebsiteContent.sort_order).all()
    return {item.key: item.value for item in items}