const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

// Public
export async function submitContact(data: { name: string; email: string; message: string }) {
  const res = await fetch(`${API_BASE}/contact`, {
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

// Admin Auth
export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(err.detail || "Login failed");
  }
  return res.json();
}

export async function adminLogout(token: string) {
  const res = await fetch(`${API_BASE}/admin/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
}

export async function getAdminMe(token: string) {
  const res = await fetch(`${API_BASE}/admin/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

// Admin - Education
export async function getEducationAdmin(token: string) {
  const res = await fetch(`${API_BASE}/admin/education`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch education");
  return res.json();
}

export async function createEducationAdmin(token: string, data: any) {
  const res = await fetch(`${API_BASE}/admin/education`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create education");
  return res.json();
}

export async function updateEducationAdmin(token: string, id: number, data: any) {
  const res = await fetch(`${API_BASE}/admin/education/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update education");
  return res.json();
}

export async function deleteEducationAdmin(token: string, id: number) {
  const res = await fetch(`${API_BASE}/admin/education/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete education");
  return res.json();
}

// Admin - Experiences
export async function getExperiencesAdmin(token: string) {
  const res = await fetch(`${API_BASE}/admin/experiences`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch experiences");
  return res.json();
}

export async function createExperienceAdmin(token: string, data: any) {
  const res = await fetch(`${API_BASE}/admin/experiences`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create experience");
  return res.json();
}

export async function updateExperienceAdmin(token: string, id: number, data: any) {
  const res = await fetch(`${API_BASE}/admin/experiences/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update experience");
  return res.json();
}

export async function deleteExperienceAdmin(token: string, id: number) {
  const res = await fetch(`${API_BASE}/admin/experiences/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete experience");
  return res.json();
}

// Admin - Projects
export async function getProjectGroupsAdmin(token: string) {
  const res = await fetch(`${API_BASE}/admin/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function createProjectGroupAdmin(token: string, data: any) {
  const res = await fetch(`${API_BASE}/admin/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create project group");
  return res.json();
}

export async function updateProjectGroupAdmin(token: string, id: number, data: any) {
  const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update project group");
  return res.json();
}

export async function deleteProjectGroupAdmin(token: string, id: number) {
  const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete project group");
  return res.json();
}

export async function getProjectItemsAdmin(token: string, groupId: number) {
  const res = await fetch(`${API_BASE}/admin/projects/${groupId}/items`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch project items");
  return res.json();
}

export async function createProjectItemAdmin(token: string, groupId: number, data: any) {
  const res = await fetch(`${API_BASE}/admin/projects/${groupId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...data, group_id: groupId }),
  });
  if (!res.ok) throw new Error("Failed to create project item");
  return res.json();
}

export async function updateProjectItemAdmin(token: string, itemId: number, data: any) {
  const res = await fetch(`${API_BASE}/admin/projects/items/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update project item");
  return res.json();
}

export async function deleteProjectItemAdmin(token: string, itemId: number) {
  const res = await fetch(`${API_BASE}/admin/projects/items/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete project item");
  return res.json();
}

// Admin - Contacts
export async function getContactsAdmin(token: string) {
  const res = await fetch(`${API_BASE}/admin/contacts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch contacts");
  return res.json();
}

export async function deleteContactAdmin(token: string, id: number) {
  const res = await fetch(`${API_BASE}/admin/contacts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete contact");
  return res.json();
}