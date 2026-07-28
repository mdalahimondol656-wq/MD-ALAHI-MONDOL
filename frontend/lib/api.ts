const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function submitContact(data: { name: string; email: string; message: string }) {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Something went wrong" }));
    throw new Error(err.detail || "Failed to send message");
  }
  return res.json();
}
