"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, User, GraduationCap, Briefcase, FolderOpen,
  Mail, LogOut, Plus, Edit2, Trash2, Save, X, RefreshCw,
  Shield, BookOpen, Award, BarChart3, CheckCircle, AlertCircle
} from "lucide-react";
import {
  getAdminMe, getEducationAdmin, createEducationAdmin, updateEducationAdmin, deleteEducationAdmin,
  getExperiencesAdmin, createExperienceAdmin, updateExperienceAdmin, deleteExperienceAdmin,
  getProjectGroupsAdmin, createProjectGroupAdmin, updateProjectGroupAdmin, deleteProjectGroupAdmin,
  getProjectItemsAdmin, createProjectItemAdmin, updateProjectItemAdmin, deleteProjectItemAdmin,
  getContactsAdmin, deleteContactAdmin, adminLogout,
  getProfile, updateProfileAdmin
} from "@/lib/api";

type Tab = "overview" | "profile" | "education" | "experience" | "projects" | "contacts";

interface AdminData {
  education: any[];
  experiences: any[];
  projects: any[];
  contacts: any[];
}

const colorBgMap: Record<string, string> = {
  cyan: "bg-cyan-500/10",
  blue: "bg-blue-500/10",
  teal: "bg-teal-500/10",
};
const colorTextMap: Record<string, string> = {
  cyan: "text-cyan-400",
  blue: "text-blue-400",
  teal: "text-teal-400",
};
const colorBorderMap: Record<string, string> = {
  cyan: "border-cyan-500/20",
  blue: "border-blue-500/20",
  teal: "border-teal-500/20",
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const [data, setData] = useState<AdminData>({
    education: [],
    experiences: [],
    projects: [],
    contacts: [],
  });
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const router = useRouter();

  const getToken = () => localStorage.getItem("admin_token") || "";

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadData = useCallback(async (token: string) => {
    try {
      const [adminData, education, experiences, projects, contacts] = await Promise.all([
        getAdminMe(token),
        getEducationAdmin(token),
        getExperiencesAdmin(token),
        getProjectGroupsAdmin(token),
        getContactsAdmin(token),
      ]);
      setAdmin(adminData);
      setData({ education, experiences, projects, contacts });
    } catch (err) {
      showNotification("error", "Failed to load data");
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }
    loadData(token);
  }, [router, loadData]);

  const handleLogout = async () => {
    const token = getToken();
    await adminLogout(token);
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const refreshData = () => {
    setLoading(true);
    loadData(getToken()).then(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" />, count: data.education.length },
    { id: "experience", label: "Experience", icon: <Briefcase className="h-4 w-4" />, count: data.experiences.length },
    { id: "projects", label: "Projects", icon: <FolderOpen className="h-4 w-4" />, count: data.projects.length },
    { id: "contacts", label: "Contacts", icon: <Mail className="h-4 w-4" />, count: data.contacts.length },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border flex items-center gap-2 text-sm font-medium ${
          notification.type === "success"
            ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
            : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {notification.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {notification.message}
        </div>
      )}

      <header className="border-b border-cyan-500/10 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
              <Shield className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">Welcome, {admin?.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              title="Refresh data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all text-sm"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                  : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? "bg-cyan-500/20 text-cyan-300" : "bg-white/10 text-slate-500"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid gap-6">
          {activeTab === "overview" && <OverviewTab data={data} />}
          {activeTab === "profile" && <ProfileTab onUpdate={refreshData} />}
          {activeTab === "education" && (
            <EducationTab
              data={data.education}
              onRefresh={refreshData}
              showNotification={showNotification}
            />
          )}
          {activeTab === "experience" && (
            <ExperienceTab
              data={data.experiences}
              onRefresh={refreshData}
              showNotification={showNotification}
            />
          )}
          {activeTab === "projects" && (
            <ProjectsTab
              data={data.projects}
              onRefresh={refreshData}
              showNotification={showNotification}
            />
          )}
          {activeTab === "contacts" && (
            <ContactsTab
              data={data.contacts}
              onRefresh={refreshData}
              showNotification={showNotification}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ data }: { data: AdminData }) {
  const stats = [
    { label: "Education", value: data.education.length, icon: <GraduationCap className="h-5 w-5" />, color: "cyan" as const },
    { label: "Experience", value: data.experiences.length, icon: <Briefcase className="h-5 w-5" />, color: "blue" as const },
    { label: "Project Groups", value: data.projects.length, icon: <FolderOpen className="h-5 w-5" />, color: "teal" as const },
    { label: "Messages", value: data.contacts.length, icon: <Mail className="h-5 w-5" />, color: "cyan" as const },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card p-6">
          <div className={`mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${colorBgMap[stat.color]} ${colorTextMap[stat.color]} ${colorBorderMap[stat.color]}`}>
            {stat.icon}
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-sm text-slate-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab({ onUpdate }: { onUpdate: () => void }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({ name: "", title: "", tagline: "", location: "", bio: "", skills: "" });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfileAdmin(token, {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      onUpdate();
      setEditing(false);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!profile && !editing) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-cyan-400" />
          Profile Settings
        </h3>
        <button onClick={() => { setForm({ name: profile?.name || "", title: profile?.title || "", tagline: profile?.tagline || "", location: profile?.location || "", bio: profile?.bio || "", skills: (profile?.skills || []).join(", ") }); setEditing(true); }} className="btn-primary">
          Edit Profile
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <User className="h-5 w-5 text-cyan-400" />
        Profile Settings
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Tagline</label>
          <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Skills (comma-separated)</label>
          <textarea value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} rows={3} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white" />
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function EducationTab({ data, onRefresh, showNotification }: { data: any[]; onRefresh: () => void; showNotification: (type: "success" | "error", message: string) => void }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ level: "", institution: "", period: "", detail: "", modules: "" });
  const [saving, setSaving] = useState(false);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({ level: item.level, institution: item.institution, period: item.period, detail: item.detail, modules: item.modules || "" });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await updateEducationAdmin(token, editingId, form);
        showNotification("success", "Education updated successfully");
      } else {
        await createEducationAdmin(token, { ...form, sort_order: 0 });
        showNotification("success", "Education added successfully");
      }
      setEditingId(null);
      setForm({ level: "", institution: "", period: "", detail: "", modules: "" });
      onRefresh();
    } catch (err) {
      showNotification("error", "Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteEducationAdmin(token, id);
      showNotification("success", "Education deleted");
      onRefresh();
    } catch (err) {
      showNotification("error", "Failed to delete education");
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-cyan-400" />
          Education Management
        </h3>
        <button
          onClick={() => { setEditingId(null); setForm({ level: "", institution: "", period: "", detail: "", modules: "" }); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Education
        </button>
      </div>

      {(editingId !== null || (form.level === "" && form.institution === "")) && (
        <div className="mb-6 p-5 rounded-xl bg-white/5 border border-cyan-500/20 space-y-3">
          <h4 className="text-sm font-semibold text-cyan-400 mb-3">{editingId ? "Edit Education" : "New Education"}</h4>
          <input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="Level (e.g., Master of Science)" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="Institution" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="Period (e.g., 2022 - 2023)" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} placeholder="Detail (e.g., CGPA, grade)" rows={2} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <textarea value={form.modules} onChange={(e) => setForm({ ...form, modules: e.target.value })} placeholder="Focus Areas (comma-separated)" rows={2} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving || !form.level || !form.institution} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/30 disabled:opacity-50">
              <Save className="h-3 w-3" /> {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => { setEditingId(null); setForm({ level: "", institution: "", period: "", detail: "", modules: "" }); }} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10">
              <X className="h-3 w-3" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
            {editingId === item.id ? (
              <div className="space-y-3">
                <input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
                <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
                <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
                <textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} rows={2} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
                <textarea value={form.modules} onChange={(e) => setForm({ ...form, modules: e.target.value })} rows={2} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/30">
                    <Save className="h-3 w-3" /> Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10">
                    <X className="h-3 w-3" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm mb-1">{item.level}</h4>
                  <p className="text-slate-400 text-xs mb-2">{item.institution} • {item.period}</p>
                  <p className="text-slate-500 text-xs">{item.detail}</p>
                  {item.modules && <p className="text-slate-600 text-xs mt-2 italic">{item.modules}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No education entries yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ExperienceTab({ data, onRefresh, showNotification }: { data: any[]; onRefresh: () => void; showNotification: (type: "success" | "error", message: string) => void }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ role: "", institution: "", period: "", detail: "", description: "" });
  const [saving, setSaving] = useState(false);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({ role: item.role, institution: item.institution, period: item.period, detail: item.detail, description: item.description || "" });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await updateExperienceAdmin(token, editingId, form);
        showNotification("success", "Experience updated successfully");
      } else {
        await createExperienceAdmin(token, { ...form, sort_order: 0 });
        showNotification("success", "Experience added successfully");
      }
      setEditingId(null);
      setForm({ role: "", institution: "", period: "", detail: "", description: "" });
      onRefresh();
    } catch (err) {
      showNotification("error", "Failed to save experience");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteExperienceAdmin(token, id);
      showNotification("success", "Experience deleted");
      onRefresh();
    } catch (err) {
      showNotification("error", "Failed to delete experience");
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-cyan-400" />
          Experience Management
        </h3>
        <button
          onClick={() => { setEditingId(null); setForm({ role: "", institution: "", period: "", detail: "", description: "" }); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </button>
      </div>

      {(editingId !== null || (form.role === "" && form.institution === "")) && (
        <div className="mb-6 p-5 rounded-xl bg-white/5 border border-cyan-500/20 space-y-3">
          <h4 className="text-sm font-semibold text-cyan-400 mb-3">{editingId ? "Edit Experience" : "New Experience"}</h4>
          <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="Institution" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="Period" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} placeholder="Detail" rows={2} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving || !form.role || !form.institution} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/30 disabled:opacity-50">
              <Save className="h-3 w-3" /> {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => { setEditingId(null); setForm({ role: "", institution: "", period: "", detail: "", description: "" }); }} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10">
              <X className="h-3 w-3" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
            {editingId === item.id ? (
              <div className="space-y-3">
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
                <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
                <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
                <textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} rows={2} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/30">
                    <Save className="h-3 w-3" /> Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10">
                    <X className="h-3 w-3" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm mb-1">{item.role}</h4>
                  <p className="text-slate-400 text-xs mb-2">{item.institution} • {item.period}</p>
                  <p className="text-slate-500 text-xs">{item.detail}</p>
                  {item.description && <p className="text-slate-600 text-xs mt-2 italic">{item.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No experience entries yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectsTab({ data, onRefresh, showNotification }: { data: any[]; onRefresh: () => void; showNotification: (type: "success" | "error", message: string) => void }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [groupForm, setGroupForm] = useState({ category: "", color: "cyan", icon: "Star" });
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [itemForm, setItemForm] = useState({ title: "", desc: "" });
  const [saving, setSaving] = useState(false);

  const handleSaveGroup = async () => {
    setSaving(true);
    try {
      if (editingGroupId) {
        await updateProjectGroupAdmin(token, editingGroupId, groupForm);
        showNotification("success", "Category updated");
      } else {
        await createProjectGroupAdmin(token, { ...groupForm, sort_order: 0 });
        showNotification("success", "Category added");
      }
      setEditingGroupId(null);
      setGroupForm({ category: "", color: "cyan", icon: "Star" });
      onRefresh();
    } catch (err) {
      showNotification("error", "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async (id: number) => {
    if (!confirm("Delete this category and all its items?")) return;
    try {
      await deleteProjectGroupAdmin(token, id);
      showNotification("success", "Category deleted");
      onRefresh();
    } catch (err) {
      showNotification("error", "Failed to delete category");
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteProjectItemAdmin(token, itemId);
      showNotification("success", "Item deleted");
      onRefresh();
    } catch (err) {
      showNotification("error", "Failed to delete item");
    }
  };

  const handleAddItem = async (groupId: number) => {
    setSaving(true);
    try {
      if (editingItemId) {
        await updateProjectItemAdmin(token, editingItemId, itemForm);
        showNotification("success", "Item updated");
      } else {
        await createProjectItemAdmin(token, groupId, itemForm);
        showNotification("success", "Item added");
      }
      setItemForm({ title: "", desc: "" });
      setEditingItemId(null);
      onRefresh();
    } catch (err) {
      showNotification("error", "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-cyan-400" />
          Projects & Skills Management
        </h3>
        <button
          onClick={() => { setEditingGroupId(null); setGroupForm({ category: "", color: "cyan", icon: "Star" }); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {(editingGroupId !== null || groupForm.category === "") && (
        <div className="mb-6 p-5 rounded-xl bg-white/5 border border-cyan-500/20 space-y-3">
          <h4 className="text-sm font-semibold text-cyan-400 mb-3">{editingGroupId ? "Edit Category" : "New Category"}</h4>
          <input value={groupForm.category} onChange={(e) => setGroupForm({ ...groupForm, category: e.target.value })} placeholder="Category name" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
          <select value={groupForm.color} onChange={(e) => setGroupForm({ ...groupForm, color: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
            <option value="cyan">Cyan</option>
            <option value="blue">Blue</option>
            <option value="teal">Teal</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleSaveGroup} disabled={saving || !groupForm.category} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/30 disabled:opacity-50">
              <Save className="h-3 w-3" /> {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => { setEditingGroupId(null); setGroupForm({ category: "", color: "cyan", icon: "Star" }); }} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10">
              <X className="h-3 w-3" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((group) => (
          <div key={group.id} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold text-sm">{group.category}</h4>
              <div className="flex gap-2">
                <button onClick={() => { setEditingGroupId(group.id); setGroupForm({ category: group.category, color: group.color, icon: group.icon }); }} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDeleteGroup(group.id)} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {group.items?.map((item: any) => (
                <div key={item.id} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white/5">
                  <div className="flex-1">
                    <p className="text-white text-xs font-medium">{item.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{item.desc}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingItemId(group.id); setItemForm({ title: item.title, desc: item.desc }); }} className="p-1 rounded text-slate-400 hover:text-cyan-400 transition-all">
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button onClick={() => handleDeleteItem(item.id)} className="p-1 rounded text-slate-400 hover:text-red-400 transition-all">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              {editingItemId === group.id ? (
                <div className="p-2 rounded-lg bg-white/5 border border-cyan-500/20 space-y-2">
                  <input value={itemForm.title} onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })} placeholder="Title" className="w-full rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white" />
                  <textarea value={itemForm.desc} onChange={(e) => setItemForm({ ...itemForm, desc: e.target.value })} placeholder="Description" rows={2} className="w-full rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white" />
                  <div className="flex gap-1">
                    <button onClick={() => handleAddItem(group.id)} disabled={saving} className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 text-xs hover:bg-cyan-500/30">
                      {saving ? "..." : "Save"}
                    </button>
                    <button onClick={() => setEditingItemId(null)} className="px-2 py-1 rounded bg-white/5 text-slate-400 text-xs hover:bg-white/10">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setEditingItemId(group.id)} className="w-full mt-2 p-2 rounded-lg border border-dashed border-white/10 text-slate-500 text-xs hover:border-cyan-500/30 hover:text-cyan-400 transition-all flex items-center justify-center gap-1">
                  <Plus className="h-3 w-3" />
                  Add Item
                </button>
              )}
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No project categories yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactsTab({ data, onRefresh, showNotification }: { data: any[]; onRefresh: () => void; showNotification: (type: "success" | "error", message: string) => void }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteContactAdmin(token, id);
      showNotification("success", "Message deleted");
      onRefresh();
    } catch (err) {
      showNotification("error", "Failed to delete message");
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Mail className="h-5 w-5 text-cyan-400" />
          Contact Messages
        </h3>
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
          {data.length} total
        </span>
      </div>
      <div className="space-y-3">
        {data.map((contact) => (
          <div key={contact.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold">
                    {contact.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">{contact.name}</h4>
                    <p className="text-slate-500 text-xs">{contact.email}</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mt-2">{contact.message}</p>
                <p className="text-slate-600 text-xs mt-2">
                  {new Date(contact.created_at).toLocaleString()}
                </p>
              </div>
              <button onClick={() => handleDelete(contact.id)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}