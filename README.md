# MD ALAHI MONDOL — CV Portfolio

A high-quality, full-stack one-page CV portfolio for **MD ALAHI MONDOL**, Graduate Psychologist / Research Consultant.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (React 19, TypeScript, Tailwind CSS v4) |
| **Backend** | FastAPI (Python 3.14) |
| **Database** | PostgreSQL (Neon) |
| **Deployment** | Vercel (frontend) + Railway/Render (backend) + Docker Compose |

## Project Structure

```
/
├── frontend/                    # Next.js app
│   ├── app/                     # App Router (layout.tsx, page.tsx, globals.css)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx          # Sticky navigation with mobile menu
│   │   ├── Hero.tsx             # Profile, name, title, tagline, CTAs
│   │   ├── Logo.tsx             # SVG logo with human silhouette
│   │   ├── About.tsx            # Bio + core competencies
│   │   ├── ExperienceTimeline.tsx # Education + Experience & Projects
│   │   ├── Projects.tsx         # Skills by category + soft skills
│   │   ├── Contact.tsx          # Contact form + info
│   │   ├── Footer.tsx
│   │   ├── Stats.tsx            # Animated counter stats section
│   │   ├── Preloader.tsx        # Loading animation
│   │   ├── CustomCursor.tsx     # Custom mouse cursor
│   │   ├── BackToTop.tsx        # Scroll-to-top button
│   │   ├── SectionDivider.tsx   # Animated section dividers
│   │   └── ScrollAnimations.tsx # Intersection observer fade-in
│   ├── lib/api.ts               # API client functions
│   ├── public/                  # Static assets (profile image, grid pattern)
│   ├── Dockerfile
│   └── package.json
│
├── backend/                     # FastAPI app
│   ├── main.py                  # API routes
│   ├── database.py              # SQLAlchemy setup
│   ├── models.py                # DB models
│   ├── schemas.py               # Pydantic schemas
│   ├── seed.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
│
├── docker-compose.yml
└── .gitignore
```

## Sections

1. **Hero** — Name, title, tagline, location, profile image, CTAs
2. **About** — Bio + core competencies (15 skills)
3. **Education** — MSc, BSc Honours, HSC, SSC with grades and modules
4. **Experience** — Internship + Audit & Compliance role
5. **Skills** — Categorized by Clinical & Counseling, Research & Analytics, Corporate & Social + Soft Skills
6. **Contact** — Contact form (name, email, message) + contact information panel

## Quick Start

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev       # http://localhost:3000
npm run build     # Production build
```

### Backend (FastAPI)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
.venv\Scripts\uvicorn main:app --reload   # http://localhost:8000/docs
```

### Full Stack (Docker)
```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# DB:       localhost:5432
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Profile data (name, title, tagline, location, bio, skills) |
| GET | `/api/education` | Education history |
| GET | `/api/experiences` | Experience & projects |
| GET | `/api/projects` | Skills categorized by domain |
| POST | `/api/contact` | Submit contact form message |

## Deployment

- **Frontend** → [Vercel](https://vercel.com) (connect GitHub repo)
- **Backend** → [Railway](https://railway.app) or [Render](https://render.com)
- **Database** → [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway PostgreSQL](https://railway.app)

Set `NEXT_PUBLIC_API_URL` in Vercel environment variables to point to the deployed backend.

## Design Theme

Clean, modern, academic-professional with cyan/blue accents — optimized for a Psychology professional. Fully responsive with mobile hamburger menu, custom cursor, preloader, and glassmorphism cards.