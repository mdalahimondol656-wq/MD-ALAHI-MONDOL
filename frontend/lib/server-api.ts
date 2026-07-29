import { headers } from "next/headers";

async function getApiBase() {
  if (typeof window === "undefined") {
    const h = await headers();
    const host = h.get("host") || "localhost:3000";
    const protocol = h.get("x-forwarded-proto") || "http";
    return `${protocol}://${host}`;
  }
  return "";
}

export async function fetchProfile() {
  try {
    const base = await getApiBase();
    const res = await fetch(`${base}/api/profile`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function fetchEducation() {
  try {
    const base = await getApiBase();
    const res = await fetch(`${base}/api/education`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchExperiences() {
  try {
    const base = await getApiBase();
    const res = await fetch(`${base}/api/experiences`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchProjects() {
  try {
    const base = await getApiBase();
    const res = await fetch(`${base}/api/projects`, { cache: "no-store" });
    if (!res.ok) return {};
    return res.json();
  } catch { return {}; }
}

export async function fetchStats() {
  try {
    const base = await getApiBase();
    const res = await fetch(`${base}/api/stats`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function fetchContactInfo() {
  try {
    const base = await getApiBase();
    const res = await fetch(`${base}/api/contact-info`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}
