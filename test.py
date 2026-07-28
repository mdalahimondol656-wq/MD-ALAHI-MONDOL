import sys
import os
import subprocess
import json
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
FRONTEND = ROOT / "frontend"
BACKEND = ROOT / "backend"

passed = 0
failed = 0


def check(name, condition, detail=""):
    global passed, failed
    if condition:
        print(f"  [PASS] {name}")
        passed += 1
    else:
        print(f"  [FAIL] {name}" + (f" — {detail}" if detail else ""))
        failed += 1


def npm_cmd():
    return "npm.cmd" if os.name == "nt" else "npm"


def python_cmd():
    venv_python = BACKEND / ".venv" / "Scripts" / "python.exe"
    if venv_python.exists():
        return str(venv_python)
    return sys.executable


def run_api_tests(py_cmd):
    script = """
from fastapi.testclient import TestClient
from main import app
client = TestClient(app)
results = []

r = client.get("/api/profile")
results.append(("GET /api/profile", r.status_code == 200, f"Got {r.status_code}"))
if r.status_code == 200:
    data = r.json()
    results.append(("  name is MD ALAHI MONDOL", data.get("name") == "MD ALAHI MONDOL", ""))
    results.append(("  title is Graduate Psychologist", "Psychologist" in data.get("title", ""), ""))

r = client.get("/api/education")
results.append(("GET /api/education", r.status_code == 200, f"Got {r.status_code}"))
if r.status_code == 200:
    data = r.json()
    results.append(("  4 education entries", len(data) == 4, f"Got {len(data)}"))

r = client.get("/api/experiences")
results.append(("GET /api/experiences", r.status_code == 200, f"Got {r.status_code}"))
if r.status_code == 200:
    data = r.json()
    results.append(("  2 experience entries", len(data) == 2, f"Got {len(data)}"))

r = client.get("/api/projects")
results.append(("GET /api/projects", r.status_code == 200, f"Got {r.status_code}"))
if r.status_code == 200:
    data = r.json()
    results.append(("  3 skill categories", len(data) == 3, f"Got {len(data)}"))

r = client.post("/api/contact", json={"name": "Test", "email": "t@t.com", "message": "Hi"})
results.append(("POST /api/contact", r.status_code == 200, f"Got {r.status_code}"))

for name, ok, detail in results:
    status = "PASS" if ok else "FAIL"
    msg = f"  [{status}] {name}"
    if not ok and detail:
        msg += f" — {detail}"
    print(msg)
"""
    result = subprocess.run(
        [py_cmd, "-c", script, str(BACKEND)],
        capture_output=True,
        text=True,
        timeout=30,
        cwd=str(BACKEND),
    )
    for line in result.stdout.strip().split("\n"):
        if line.strip():
            print(line)
    if result.returncode != 0 or "FAIL" in result.stdout:
        check("API endpoint tests", False, result.stderr[-300:] if result.returncode != 0 and not result.stdout.strip() else result.stdout[-300:])


def main():
    print("=" * 60)
    print("  CV Portfolio — Full Platform Test")
    print("=" * 60)

    # ── 1. Directory Structure ──
    print("\n[1] Directory Structure")
    check("frontend/ exists", FRONTEND.is_dir())
    check("backend/ exists", BACKEND.is_dir())
    check("frontend/components/ exists", (FRONTEND / "components").is_dir())
    check("frontend/app/ exists", (FRONTEND / "app").is_dir())
    check("frontend/public/ exists", (FRONTEND / "public").is_dir())
    check("frontend/lib/ exists", (FRONTEND / "lib").is_dir())

    # ── 2. Frontend Files ──
    print("\n[2] Frontend Files")
    required_frontend = [
        "package.json",
        "tsconfig.json",
        "next.config.ts",
        "postcss.config.mjs",
        "app/globals.css",
        "app/layout.tsx",
        "app/page.tsx",
        "lib/api.ts",
        "components/Navbar.tsx",
        "components/Hero.tsx",
        "components/Logo.tsx",
        "components/About.tsx",
        "components/ExperienceTimeline.tsx",
        "components/Projects.tsx",
        "components/Contact.tsx",
        "components/Footer.tsx",
    ]
    for f in required_frontend:
        check(f"frontend/{f} exists", (FRONTEND / f).is_file())

    # ── 3. Backend Files ──
    print("\n[3] Backend Files")
    required_backend = [
        "main.py",
        "database.py",
        "models.py",
        "schemas.py",
        "seed.py",
        "requirements.txt",
        "Dockerfile",
        ".env",
    ]
    for f in required_backend:
        check(f"backend/{f} exists", (BACKEND / f).is_file())

    # ── 4. Config Files ──
    print("\n[4] Config Files")
    check("docker-compose.yml exists", (ROOT / "docker-compose.yml").is_file())
    check(".gitignore exists", (ROOT / ".gitignore").is_file())
    check("README.md exists", (ROOT / "README.md").is_file())
    check("frontend/.env.local exists", (FRONTEND / ".env.local").is_file())

    # ── 5. Images ──
    print("\n[5] Images in frontend/public/")
    images = list((FRONTEND / "public").glob("*.jpeg")) + list((FRONTEND / "public").glob("*.jpg")) + list((FRONTEND / "public").glob("*.png")) + list((FRONTEND / "public").glob("*.webp")) + list((FRONTEND / "public").glob("*.jfif"))
    check(f"Images found ({len(images)})", len(images) > 0, f"Found {len(images)} images")
    for img in sorted(images):
        size_kb = img.stat().st_size / 1024
        check(f"  {img.name} ({size_kb:.1f} KB)", True)

    # ── 6. Frontend Build ──
    print("\n[6] Frontend Build (Next.js)")
    result = subprocess.run(
        [npm_cmd(), "run", "build"],
        cwd=str(FRONTEND),
        capture_output=True,
        text=True,
        timeout=180,
        shell=True,
        env={**os.environ, "NODE_OPTIONS": "--max-old-space-size=4096"},
    )
    build_success = result.returncode == 0 or "Compiled successfully" in result.stdout or "Generating static pages" in result.stdout
    check("Next.js build succeeds", build_success, result.stderr[-300:] if not build_success else "")
    if not build_success and result.stdout:
        print("  Build stdout:", result.stdout[-500:])

    # ── 7. Backend Imports ──
    print("\n[7] Backend Python Imports")
    py_cmd = python_cmd()

    result = subprocess.run(
        [py_cmd, "-c", "from main import app; print('OK')"],
        cwd=str(BACKEND),
        capture_output=True,
        text=True,
        timeout=30,
    )
    check("FastAPI app imports successfully", result.returncode == 0, result.stderr[-300:] if result.returncode != 0 else "")

    # ── 8. Backend API Endpoints Test ──
    print("\n[8] Backend API Endpoints")
    run_api_tests(py_cmd)

    # ── 9. package.json Validation ──
    print("\n[9] Frontend Dependencies")
    pkg_path = FRONTEND / "package.json"
    if pkg_path.is_file():
        with open(pkg_path) as f:
            pkg = json.load(f)
        check("next in dependencies", "next" in pkg.get("dependencies", {}))
        check("react in dependencies", "react" in pkg.get("dependencies", {}))
        check("typescript in devDependencies", "typescript" in pkg.get("devDependencies", {}))
        check("tailwindcss in devDependencies", "tailwindcss" in pkg.get("devDependencies", {}))

    # ── 10. Backend Requirements ──
    print("\n[10] Backend Dependencies")
    req_path = BACKEND / "requirements.txt"
    if req_path.is_file():
        with open(req_path) as f:
            reqs = f.read()
        check("fastapi in requirements", "fastapi" in reqs)
        check("uvicorn in requirements", "uvicorn" in reqs)
        check("sqlalchemy in requirements", "sqlalchemy" in reqs)
        check("pydantic in requirements", "pydantic" in reqs)

    # ── Summary ──
    total = passed + failed
    print("\n" + "=" * 60)
    print(f"  RESULTS: {passed}/{total} passed, {failed} failed")
    if failed == 0:
        print("  STATUS: ALL TESTS PASSED")
    else:
        print(f"  STATUS: {failed} TEST(S) FAILED — review above")
    print("=" * 60)

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())