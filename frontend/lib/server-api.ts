const API_BASE = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");

export async function fetchProfile() {
  try {
    const res = await fetch(`${API_BASE}/api/profile`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function fetchEducation() {
  try {
    const res = await fetch(`${API_BASE}/api/education`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchExperiences() {
  try {
    const res = await fetch(`${API_BASE}/api/experiences`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchProjects() {
  try {
    const res = await fetch(`${API_BASE}/api/projects`, { cache: "no-store" });
    if (!res.ok) return {};
    return res.json();
  } catch { return {}; }
}

export async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/api/stats`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchContactInfo() {
  try {
    const res = await fetch(`${API_BASE}/api/contact-info`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}
