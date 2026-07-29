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
from models import ContactMessage, AdminUser, Education, Experience, ProjectGroup, ProjectItem
from schemas import (
    ContactCreate, ContactResponse,
    ProfileUpdate,
    EducationCreate, EducationUpdate, EducationResponse,
    ExperienceCreate, ExperienceUpdate, ExperienceResponse,
    ProjectGroupCreate, ProjectGroupUpdate, ProjectGroupResponse,
    ProjectItemCreate, ProjectItemUpdate, ProjectItemResponse,
    AdminLogin, AdminToken, AdminUserResponse, AdminCreate
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
    finally:
        db.close()
    yield


app = FastAPI(title="MD ALAHI MONDOL — CV Portfolio API", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://your-vercel-app.vercel.app", "https://md-alahi-mondol.vercel.app", "https://mdalahimondol656-2022.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Public Endpoints ────────────────────────────────────────────

@app.get("/api/profile")
def get_profile():
    return {
        "name": "MD ALAHI MONDOL",
        "title": "Graduate Psychologist / Research Consultant",
        "tagline": "Bridging academic excellence in Psychology with data-driven behavioral insights.",
        "location": "Kurigram / Dhaka, Bangladesh",
        "bio": "Analytical and dedicated Psychology graduate with a comprehensive academic background spanning a Master of Science (M.Sc.) and a Bachelor of Science (B.Sc. Honours) from the University of Dhaka (Dhaka College). Equipped with a robust understanding of human behavior, clinical counseling frameworks, organizational dynamics, and environmental psychology. Proven capability in structured academic environments, backed by hands-on internship experience and structured project execution. Ready to leverage strong research methodology, data evaluation, and behavioral analysis skills to drive impactful solutions in psychological research, counseling, or human resources.",
        "skills": [
            "Clinical Psychology", "Counseling Frameworks", "Behavioral Analysis",
            "Industrial-Organizational Psychology", "Environmental Psychology",
            "Child Development Assessment", "Educational Psychology",
            "Positive Psychology", "Social Psychology", "Cognitive Psychology",
            "Field Data Collection", "Research Methodology", "Case Studies",
            "Academic Reporting", "Active Listening", "Empathy",
        ],
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