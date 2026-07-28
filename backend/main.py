from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import ContactMessage
from schemas import ContactCreate, ContactResponse


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="MD ALAHI MONDOL — CV Portfolio API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-vercel-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
def get_education():
    return [
        {
            "level": "Master of Science (M.Sc.) in Psychology",
            "institution": "University of Dhaka (Affiliated Dhaka College)",
            "period": "2022 - 2023",
            "detail": "Graduated March 2025 | Final CGPA: 3.10 / 4.00",
            "modules": "Clinical & Counseling Psychology, Industrial-Organizational Psychology, Environmental Psychology, Child Development & Disabilities, Advanced Social Psychology, School Psychology",
        },
        {
            "level": "Bachelor of Science (B.Sc. Honours) in Psychology",
            "institution": "University of Dhaka (Affiliated Dhaka College)",
            "period": "2018 - 2019",
            "detail": "Graduated May 2024 | Final CGPA: 2.96 / 4.00 (4th Year GPA: 2.93)",
            "modules": "Positive Psychology, Personality Psychology, Theories of Learning, History & Systems in Psychology, Cognitive Psychology, Educational Psychology",
        },
        {
            "level": "Higher Secondary Certificate (HSC)",
            "institution": "Lalmonirhat Govt. College, Lalmonirhat",
            "period": "2016 - 2018",
            "detail": "Board: Dinajpur | Group: Humanities | GPA: 3.50 / 5.00",
            "modules": "",
        },
        {
            "level": "Secondary School Certificate (SSC)",
            "institution": "Phulkha Adarsha High School, Kurigram",
            "period": "2014 - 2016",
            "detail": "Board: Dinajpur | Group: Science | GPA: 4.00 / 5.00",
            "modules": "",
        },
    ]


@app.get("/api/experiences")
def get_experiences():
    return [
        {
            "role": "Graduate Intern — Psychology Department",
            "institution": "University of Dhaka",
            "period": "M.Sc. Requirement",
            "detail": "Grade: A (Excellent) — Grade Point: 3.75",
            "description": "Applied theoretical psychological frameworks in active field settings, managed case data, and observed practical behavioral interventions.",
        },
        {
            "role": "Independent Research Project",
            "institution": "University of Dhaka",
            "period": "Academic Project",
            "detail": "Grade: A+ (Outstanding) — Grade Point: 4.00",
            "description": "Formulated research methodologies, compiled field data, performed analytical reviews on behavioral subsets, and defended project findings before the academic board.",
        },
    ]


@app.get("/api/projects")
def get_projects():
    return {
        "Clinical & Counseling": [
            {"title": "Counseling Frameworks", "desc": "Applied structured counseling approaches in field settings with case documentation and behavioral tracking."},
            {"title": "Behavioral Analysis", "desc": "Observed and documented behavioral patterns across diverse populations using standardized assessment tools."},
            {"title": "Child Development Assessment", "desc": "Evaluated developmental milestones and learning behaviors in educational settings."},
        ],
        "Research & Analytics": [
            {"title": "Field Data Collection", "desc": "Designed and executed data collection protocols for psychological studies with rigorous methodology."},
            {"title": "Psychological Project Design", "desc": "Formulated research methodologies, compiled field data, and performed analytical reviews on behavioral subsets."},
            {"title": "Academic Reporting", "desc": "Produced structured academic reports with evidence-based findings and recommendations."},
        ],
        "Corporate & Social": [
            {"title": "Industrial-Organizational Psychology", "desc": "Applied organizational behavior principles to workplace dynamics and team performance analysis."},
            {"title": "Positive Psychology Frameworks", "desc": "Utilized strengths-based approaches to promote well-being and resilience in organizational settings."},
            {"title": "Social Psychology Dynamics", "desc": "Analyzed group behavior, social influence, and interpersonal dynamics in structured environments."},
        ],
    }


@app.post("/api/contact", response_model=ContactResponse)
def create_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    msg = ContactMessage(**payload.model_dump())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
