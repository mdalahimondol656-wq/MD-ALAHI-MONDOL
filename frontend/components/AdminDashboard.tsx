"use client";
import { useState, useEffect, useCallback, useMemo, Fragment } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, User, GraduationCap, Briefcase, FolderOpen,
  Mail, LogOut, Plus, Edit2, Trash2, Save, X, RefreshCw,
  Shield, Zap, Settings, ChevronLeft, ChevronRight, Search,
  CheckCircle, AlertCircle, Menu, Eye, Clock, BarChart3,
  Award, TrendingUp, Link2, Globe, Phone, MessageSquare, ExternalLink, Loader2
} from "lucide-react";
import {
  getAdminMe, getEducationAdmin, createEducationAdmin, updateEducationAdmin, deleteEducationAdmin,
  getExperiencesAdmin, createExperienceAdmin, updateExperienceAdmin, deleteExperienceAdmin,
  getProjectGroupsAdmin, createProjectGroupAdmin, updateProjectGroupAdmin, deleteProjectGroupAdmin,
  getProjectItemsAdmin, createProjectItemAdmin, updateProjectItemAdmin, deleteProjectItemAdmin,
  getContactsAdmin, deleteContactAdmin, adminLogout,
  getProfile, updateProfileAdmin,
  getContentAdmin, createContentAdmin, updateContentAdmin, deleteContentAdmin
} from "@/lib/api";

type Section = "overview" | "profile" | "skills" | "education" | "experience" | "projects" | "content" | "messages";

interface AdminData {
  education: any[];
  experiences: any[];
  projects: any[];
  contacts: any[];
  content: any[];
}

interface Toast {
  id: number;
  type: "success" | "error" | "info";
  message: string;
}

let toastId = 0;

export default function AdminDashboard() {
  const [section, setSection] = useState<Section>("overview");
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [data, setData] = useState<AdminData>({ education: [], experiences: [], projects: [], contacts: [], content: [] });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const getToken = () => localStorage.getItem("admin_token") || "";

  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const loadData = useCallback(async (token: string) => {
    try {
      const [adminData, education, experiences, projects, contacts, content] = await Promise.all([
        getAdminMe(token), getEducationAdmin(token), getExperiencesAdmin(token),
        getProjectGroupsAdmin(token), getContactsAdmin(token), getContentAdmin(token),
      ]);
      setAdmin(adminData);
      setData({ education, experiences, projects, contacts, content });
    } catch {
      addToast("error", "Failed to load data");
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push("/admin/login"); return; }
    loadData(token);
  }, [router, loadData]);

  const handleLogout = async () => {
    await adminLogout(getToken());
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const refreshData = () => {
    loadData(getToken());
  };

  const navItems: { id: Section; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    { id: "skills", label: "Skills", icon: <Zap className="h-5 w-5" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="h-5 w-5" />, count: data.education.length },
    { id: "experience", label: "Experience", icon: <Briefcase className="h-5 w-5" />, count: data.experiences.length },
    { id: "projects", label: "Projects", icon: <FolderOpen className="h-5 w-5" />, count: data.projects.length },
    { id: "content", label: "Content", icon: <Settings className="h-5 w-5" />, count: data.content.length },
    { id: "messages", label: "Messages", icon: <Mail className="h-5 w-5" />, count: data.contacts.length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl text-sm font-medium animate-slide-in ${
            toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
            toast.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" :
            "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
          }`}>
            {toast.type === "success" ? <CheckCircle className="h-4 w-4 shrink-0" /> :
             toast.type === "error" ? <AlertCircle className="h-4 w-4 shrink-0" /> :
             <Eye className="h-4 w-4 shrink-0" />}
            {toast.message}
          </div>
        ))}
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col border-r border-white/5 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-white truncate">Admin Panel</h1>
              <p className="text-[10px] text-slate-500 truncate">Welcome, {admin?.username}</p>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); setMobileSidebarOpen(false); setSearchQuery(""); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                section === item.id
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5"
                  : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      section === item.id ? "bg-cyan-500/20 text-cyan-300" : "bg-white/10 text-slate-500"
                    }`}>{item.count}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-white/5 p-3 space-y-1">
          <button
            onClick={refreshData}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all"
            title="Refresh data"
          >
            <RefreshCw className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Refresh</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5 shrink-0" /> : <ChevronRight className="h-5 w-5 shrink-0" />}
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white capitalize">{section}</h2>
              <p className="text-xs text-slate-500">
                {section === "overview" && "Portfolio at a glance"}
                {section === "profile" && "Manage your personal information"}
                {section === "skills" && "Add or remove skills"}
                {section === "education" && "Academic background"}
                {section === "experience" && "Work & research experience"}
                {section === "projects" && "Skills categories & items"}
                {section === "content" && "Stats, contact info & social links"}
                {section === "messages" && "Contact form submissions"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
            </div>
            <a href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all text-sm">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">View Site</span>
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {section === "overview" && <OverviewSection data={data} />}
          {section === "profile" && <ProfileSection addToast={addToast} onRefresh={refreshData} />}
          {section === "skills" && <SkillsSection data={data.content} addToast={addToast} onRefresh={refreshData} searchQuery={searchQuery} />}
          {section === "education" && <EducationSection data={data.education} addToast={addToast} onRefresh={refreshData} searchQuery={searchQuery} />}
          {section === "experience" && <ExperienceSection data={data.experiences} addToast={addToast} onRefresh={refreshData} searchQuery={searchQuery} />}
          {section === "projects" && <ProjectsSection data={data.projects} addToast={addToast} onRefresh={refreshData} searchQuery={searchQuery} />}
          {section === "content" && <ContentSection data={data.content} addToast={addToast} onRefresh={refreshData} searchQuery={searchQuery} />}
          {section === "messages" && <MessagesSection data={data.contacts} addToast={addToast} onRefresh={refreshData} searchQuery={searchQuery} />}
        </main>
      </div>
    </div>
  );
}

/* ─── Overview Section ────────────────────────────────────────── */
function OverviewSection({ data }: { data: AdminData }) {
  const skills = data.content.filter((c) => c.section === "skills");
  const stats = data.content.filter((c) => c.section === "stats");
  const socials = data.content.filter((c) => c.section === "social");

  const cards = [
    { label: "Education", value: data.education.length, icon: <GraduationCap className="h-6 w-6" />, color: "from-cyan-500 to-blue-600", bg: "bg-cyan-500/10" },
    { label: "Experience", value: data.experiences.length, icon: <Briefcase className="h-6 w-6" />, color: "from-blue-500 to-indigo-600", bg: "bg-blue-500/10" },
    { label: "Project Groups", value: data.projects.length, icon: <FolderOpen className="h-6 w-6" />, color: "from-teal-500 to-emerald-600", bg: "bg-teal-500/10" },
    { label: "Skills", value: skills.length, icon: <Zap className="h-6 w-6" />, color: "from-violet-500 to-purple-600", bg: "bg-violet-500/10" },
    { label: "Contact Messages", value: data.contacts.length, icon: <Mail className="h-6 w-6" />, color: "from-amber-500 to-orange-600", bg: "bg-amber-500/10" },
    { label: "Content Items", value: data.content.length, icon: <Settings className="h-6 w-6" />, color: "from-rose-500 to-pink-600", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-xl ${card.bg} flex items-center justify-center text-white/80`}>
                {card.icon}
              </div>
              <span className="text-3xl font-black text-white">{card.value}</span>
            </div>
            <p className="text-sm text-slate-400 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            {[
              { label: "Add Education", icon: <GraduationCap className="h-4 w-4" />, action: "education" },
              { label: "Add Experience", icon: <Briefcase className="h-4 w-4" />, action: "experience" },
              { label: "Add Skill", icon: <Zap className="h-4 w-4" />, action: "skills" },
              { label: "Manage Content", icon: <Settings className="h-4 w-4" />, action: "content" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-slate-300">
                <span className="text-cyan-400">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Eye className="h-4 w-4 text-cyan-400" />
            Content Summary
          </h3>
          <div className="space-y-3">
            {[
              { label: "Skills defined", value: skills.length, max: 20 },
              { label: "Stats configured", value: stats.length / 5, max: 4 },
              { label: "Social links", value: socials.length, max: 4 },
              { label: "Messages received", value: data.contacts.length, max: 50 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="text-slate-500">{item.value}/{item.max}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Profile Section ─────────────────────────────────────────── */
function ProfileSection({ addToast, onRefresh }: { addToast: (type: "success" | "error" | "info", msg: string) => void; onRefresh: () => void }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({ name: "", title: "", tagline: "", location: "", bio: "" });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { getProfile().then(setProfile).catch(() => {}); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfileAdmin(token, form);
      addToast("success", "Profile updated successfully");
      setEditing(false);
      onRefresh();
    } catch { addToast("error", "Failed to update profile"); }
    finally { setSaving(false); }
  };

  const fields = [
    { key: "name", label: "Full Name", type: "input" },
    { key: "title", label: "Professional Title", type: "input" },
    { key: "tagline", label: "Tagline", type: "input" },
    { key: "location", label: "Location", type: "input" },
    { key: "bio", label: "Bio", type: "textarea" },
  ] as const;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Profile Settings</h3>
              <p className="text-xs text-slate-500">Update your personal information</p>
            </div>
          </div>
          {!editing && (
            <button onClick={() => { setForm({ name: profile?.name || "", title: profile?.title || "", tagline: profile?.tagline || "", location: profile?.location || "", bio: profile?.bio || "" }); setEditing(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 text-sm font-medium transition-all">
              <Edit2 className="h-4 w-4" /> Edit Profile
            </button>
          )}
        </div>

        {!editing ? (
          <div className="space-y-4">
            {fields.map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</label>
                <p className="mt-1 text-sm text-white">{profile?.[key] || "—"}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                {type === "textarea" ? (
                  <textarea value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} rows={4}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all" />
                ) : (
                  <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all" />
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={() => setEditing(false)} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/10 transition-all">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Skills Section ──────────────────────────────────────────── */
function SkillsSection({ data, addToast, onRefresh, searchQuery }: { data: any[]; addToast: (type: "success" | "error" | "info", msg: string) => void; onRefresh: () => void; searchQuery: string }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
  const skills = useMemo(() => {
    const items = data.filter((c) => c.section === "skills");
    return searchQuery ? items.filter((s) => s.value.toLowerCase().includes(searchQuery.toLowerCase())) : items;
  }, [data, searchQuery]);
  const [newSkill, setNewSkill] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!newSkill.trim()) return;
    setSaving(true);
    try {
      await createContentAdmin(token, { section: "skills", key: "skill", value: newSkill.trim(), sort_order: skills.length });
      addToast("success", "Skill added");
      setNewSkill("");
      onRefresh();
    } catch { addToast("error", "Failed to add skill"); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (id: number) => {
    setSaving(true);
    try {
      await updateContentAdmin(token, id, { value: editValue });
      addToast("success", "Skill updated");
      setEditingId(null);
      onRefresh();
    } catch { addToast("error", "Failed to update skill"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteContentAdmin(token, id);
      addToast("success", "Skill deleted");
      onRefresh();
    } catch { addToast("error", "Failed to delete skill"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Type a new skill and press Enter..."
            className="w-full pl-4 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
        </div>
        <button onClick={handleAdd} disabled={saving || !newSkill.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20 shrink-0">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add Skill
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <div key={skill.id} className="group flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all duration-200">
            {editingId === skill.id ? (
              <div className="flex items-center gap-2 flex-1">
                <input value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleUpdate(skill.id)} autoFocus
                  className="flex-1 rounded-lg border border-cyan-500/30 bg-white/[0.05] px-3 py-1.5 text-sm text-white focus:outline-none" />
                <button onClick={() => handleUpdate(skill.id)} className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"><Save className="h-3.5 w-3.5" /></button>
                <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10"><X className="h-3.5 w-3.5" /></button>
              </div>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 shrink-0" />
                <span className="flex-1 text-sm text-slate-300 truncate">{skill.value}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingId(skill.id); setEditValue(skill.value); }} className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"><Edit2 className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleDelete(skill.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {skills.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Zap className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">{searchQuery ? "No skills match your search" : "No skills yet. Add one above!"}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Education Section ───────────────────────────────────────── */
function EducationSection({ data, addToast, onRefresh, searchQuery }: { data: any[]; addToast: (type: "success" | "error" | "info", msg: string) => void; onRefresh: () => void; searchQuery: string }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
  const items = useMemo(() => {
    return searchQuery ? data.filter((e) => e.level.toLowerCase().includes(searchQuery.toLowerCase()) || e.institution.toLowerCase().includes(searchQuery.toLowerCase())) : data;
  }, [data, searchQuery]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ level: "", institution: "", period: "", detail: "", modules: "" });
  const [saving, setSaving] = useState(false);

  const resetForm = () => { setForm({ level: "", institution: "", period: "", detail: "", modules: "" }); setEditingId(null); setShowForm(false); };
  const handleEdit = (item: any) => { setEditingId(item.id); setForm({ level: item.level, institution: item.institution, period: item.period, detail: item.detail, modules: item.modules || "" }); setShowForm(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) { await updateEducationAdmin(token, editingId, form); addToast("success", "Education updated"); }
      else { await createEducationAdmin(token, { ...form, sort_order: 0 }); addToast("success", "Education added"); }
      resetForm(); onRefresh();
    } catch { addToast("error", "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteEducationAdmin(token, id); addToast("success", "Deleted"); onRefresh(); }
    catch { addToast("error", "Failed to delete"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{items.length} {items.length === 1 ? "entry" : "entries"}</p>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20">
          <Plus className="h-4 w-4" /> Add Education
        </button>
      </div>

      {showForm && (
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-cyan-500/20 space-y-4 animate-slide-down">
          <h4 className="text-sm font-bold text-cyan-400">{editingId ? "Edit Education" : "New Education"}</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="Level (e.g., Master of Science)" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
            <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="Institution" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
            <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="Period (e.g., 2022 - 2023)" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
            <input value={form.modules} onChange={(e) => setForm({ ...form, modules: e.target.value })} placeholder="Focus Areas (comma-separated)" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
          </div>
          <textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} placeholder="Detail (e.g., CGPA, grade)" rows={2}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving || !form.level || !form.institution}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={resetForm} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/10 transition-all">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-sm">{item.level}</h4>
                <p className="text-cyan-400/80 text-xs mt-1">{item.institution}</p>
                <p className="text-slate-500 text-xs mt-0.5">{item.period}</p>
                <p className="text-slate-400 text-xs mt-2">{item.detail}</p>
                {item.modules && <p className="text-slate-600 text-xs mt-2 italic">{item.modules}</p>}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => handleEdit(item)} className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">{searchQuery ? "No entries match your search" : "No education entries yet"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Experience Section ──────────────────────────────────────── */
function ExperienceSection({ data, addToast, onRefresh, searchQuery }: { data: any[]; addToast: (type: "success" | "error" | "info", msg: string) => void; onRefresh: () => void; searchQuery: string }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
  const items = useMemo(() => {
    return searchQuery ? data.filter((e) => e.role.toLowerCase().includes(searchQuery.toLowerCase()) || e.institution.toLowerCase().includes(searchQuery.toLowerCase())) : data;
  }, [data, searchQuery]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ role: "", institution: "", period: "", detail: "", description: "" });
  const [saving, setSaving] = useState(false);

  const resetForm = () => { setForm({ role: "", institution: "", period: "", detail: "", description: "" }); setEditingId(null); setShowForm(false); };
  const handleEdit = (item: any) => { setEditingId(item.id); setForm({ role: item.role, institution: item.institution, period: item.period, detail: item.detail, description: item.description || "" }); setShowForm(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingId) { await updateExperienceAdmin(token, editingId, form); addToast("success", "Experience updated"); }
      else { await createExperienceAdmin(token, { ...form, sort_order: 0 }); addToast("success", "Experience added"); }
      resetForm(); onRefresh();
    } catch { addToast("error", "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteExperienceAdmin(token, id); addToast("success", "Deleted"); onRefresh(); }
    catch { addToast("error", "Failed to delete"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{items.length} {items.length === 1 ? "entry" : "entries"}</p>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20">
          <Plus className="h-4 w-4" /> Add Experience
        </button>
      </div>

      {showForm && (
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-cyan-500/20 space-y-4 animate-slide-down">
          <h4 className="text-sm font-bold text-cyan-400">{editingId ? "Edit Experience" : "New Experience"}</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
            <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="Institution" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
            <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="Period" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
          </div>
          <textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} placeholder="Detail (e.g., Grade, achievements)" rows={2}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving || !form.role || !form.institution}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={resetForm} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/10 transition-all">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-sm">{item.role}</h4>
                <p className="text-cyan-400/80 text-xs mt-1">{item.institution}</p>
                <p className="text-slate-500 text-xs mt-0.5">{item.period}</p>
                <p className="text-slate-400 text-xs mt-2">{item.detail}</p>
                {item.description && <p className="text-slate-500 text-xs mt-2 italic leading-relaxed">{item.description}</p>}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => handleEdit(item)} className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">{searchQuery ? "No entries match your search" : "No experience entries yet"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Projects Section ────────────────────────────────────────── */
function ProjectsSection({ data, addToast, onRefresh, searchQuery }: { data: any[]; addToast: (type: "success" | "error" | "info", msg: string) => void; onRefresh: () => void; searchQuery: string }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [groupForm, setGroupForm] = useState({ category: "", color: "cyan", icon: "Star" });
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [itemForm, setItemForm] = useState({ title: "", desc: "" });
  const [saving, setSaving] = useState(false);

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((g) => g.category.toLowerCase().includes(searchQuery.toLowerCase()) || g.items?.some((i: any) => i.title.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [data, searchQuery]);

  const handleSaveGroup = async () => {
    setSaving(true);
    try {
      if (editingGroupId) { await updateProjectGroupAdmin(token, editingGroupId, groupForm); addToast("success", "Category updated"); }
      else { await createProjectGroupAdmin(token, { ...groupForm, sort_order: 0 }); addToast("success", "Category added"); }
      setShowGroupForm(false); setEditingGroupId(null); setGroupForm({ category: "", color: "cyan", icon: "Star" }); onRefresh();
    } catch { addToast("error", "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDeleteGroup = async (id: number) => {
    try { await deleteProjectGroupAdmin(token, id); addToast("success", "Category deleted"); onRefresh(); }
    catch { addToast("error", "Failed to delete"); }
  };

  const handleSaveItem = async (groupId: number) => {
    setSaving(true);
    try {
      if (editingItemId) { await updateProjectItemAdmin(token, editingItemId, itemForm); addToast("success", "Item updated"); }
      else { await createProjectItemAdmin(token, groupId, itemForm); addToast("success", "Item added"); }
      setItemForm({ title: "", desc: "" }); setEditingItemId(null); onRefresh();
    } catch { addToast("error", "Failed to save item"); }
    finally { setSaving(false); }
  };

  const handleDeleteItem = async (itemId: number) => {
    try { await deleteProjectItemAdmin(token, itemId); addToast("success", "Item deleted"); onRefresh(); }
    catch { addToast("error", "Failed to delete"); }
  };

  const colorMap: Record<string, string> = {
    cyan: "from-cyan-500 to-blue-600",
    blue: "from-blue-500 to-indigo-600",
    teal: "from-teal-500 to-emerald-600",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{data.length} {data.length === 1 ? "category" : "categories"}</p>
        <button onClick={() => { setShowGroupForm(true); setEditingGroupId(null); setGroupForm({ category: "", color: "cyan", icon: "Star" }); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {showGroupForm && (
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-cyan-500/20 space-y-4 animate-slide-down">
          <h4 className="text-sm font-bold text-cyan-400">{editingGroupId ? "Edit Category" : "New Category"}</h4>
          <div className="flex gap-3">
            <input value={groupForm.category} onChange={(e) => setGroupForm({ ...groupForm, category: e.target.value })} placeholder="Category name"
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
            <select value={groupForm.color} onChange={(e) => setGroupForm({ ...groupForm, color: e.target.value })}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all">
              <option value="cyan">Cyan</option>
              <option value="blue">Blue</option>
              <option value="teal">Teal</option>
            </select>
            <button onClick={handleSaveGroup} disabled={saving || !groupForm.category}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-50 transition-all">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
            </button>
            <button onClick={() => setShowGroupForm(false)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm hover:bg-white/10 transition-all">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.map((group) => (
          <div key={group.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${colorMap[group.color] || colorMap.cyan} flex items-center justify-center`}>
                  <FolderOpen className="h-4 w-4 text-white" />
                </div>
                <h4 className="text-white font-bold text-sm">{group.category}</h4>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditingGroupId(group.id); setGroupForm({ category: group.category, color: group.color, icon: group.icon }); setShowGroupForm(true); }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"><Edit2 className="h-3.5 w-3.5" /></button>
                <button onClick={() => handleDeleteGroup(group.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="space-y-2">
              {group.items?.map((item: any) => (
                <div key={item.id} className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/5 group/item">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold">{item.title}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2">{item.desc}</p>
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => { setEditingItemId(item.id); setItemForm({ title: item.title, desc: item.desc }); }} className="p-1 rounded text-slate-400 hover:text-cyan-400"><Edit2 className="h-3 w-3" /></button>
                    <button onClick={() => handleDeleteItem(item.id)} className="p-1 rounded text-slate-400 hover:text-red-400"><Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
              {editingItemId === group.id ? (
                <div className="p-3 rounded-xl bg-white/[0.03] border border-cyan-500/20 space-y-2">
                  <input value={itemForm.title} onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })} placeholder="Title"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white focus:outline-none" />
                  <textarea value={itemForm.desc} onChange={(e) => setItemForm({ ...itemForm, desc: e.target.value })} placeholder="Description" rows={2}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white focus:outline-none" />
                  <div className="flex gap-2">
                    <button onClick={() => handleSaveItem(group.id)} disabled={saving}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 disabled:opacity-50">
                      {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />} Save
                    </button>
                    <button onClick={() => setEditingItemId(null)} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs hover:bg-white/10">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setEditingItemId(group.id)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-dashed border-white/10 text-slate-500 text-xs hover:border-cyan-500/30 hover:text-cyan-400 transition-all flex items-center justify-center gap-1.5">
                  <Plus className="h-3 w-3" /> Add Item
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredGroups.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">{searchQuery ? "No categories match your search" : "No project categories yet"}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Content Section ─────────────────────────────────────────── */
function ContentSection({ data, addToast, onRefresh, searchQuery }: { data: any[]; addToast: (type: "success" | "error" | "info", msg: string) => void; onRefresh: () => void; searchQuery: string }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
  const [activeSection, setActiveSection] = useState("stats");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [saving, setSaving] = useState(false);

  const sections = ["stats", "contact", "social", "profile"];
  const sectionLabels: Record<string, string> = { stats: "Statistics", contact: "Contact Info", social: "Social Links", profile: "Profile" };
  const sectionIcons: Record<string, React.ReactNode> = { stats: <BarChart3 className="h-4 w-4" />, contact: <Phone className="h-4 w-4" />, social: <Globe className="h-4 w-4" />, profile: <User className="h-4 w-4" /> };

  const sectionItems = useMemo(() => {
    const items = data.filter((d) => d.section === activeSection);
    return searchQuery ? items.filter((i) => i.key.toLowerCase().includes(searchQuery.toLowerCase()) || i.value.toLowerCase().includes(searchQuery.toLowerCase())) : items;
  }, [data, activeSection, searchQuery]);

  const handleUpdate = async (id: number) => {
    setSaving(true);
    try { await updateContentAdmin(token, id, { value: editValue }); addToast("success", "Updated"); setEditingId(null); onRefresh(); }
    catch { addToast("error", "Failed to update"); }
    finally { setSaving(false); }
  };

  const handleAdd = async () => {
    if (!newKey.trim() || !newValue.trim()) return;
    setSaving(true);
    try { await createContentAdmin(token, { section: activeSection, key: newKey.trim(), value: newValue.trim(), sort_order: sectionItems.length }); addToast("success", "Added"); setNewKey(""); setNewValue(""); onRefresh(); }
    catch { addToast("error", "Failed to add"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteContentAdmin(token, id); addToast("success", "Deleted"); onRefresh(); }
    catch { addToast("error", "Failed to delete"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map((s) => (
          <button key={s} onClick={() => { setActiveSection(s); setEditingId(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeSection === s ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20" : "bg-white/[0.03] text-slate-400 border border-white/5 hover:bg-white/[0.06] hover:text-white"
            }`}>
            {sectionIcons[s]}
            {sectionLabels[s]}
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-white/10">{data.filter((d) => d.section === s).length}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="Key (e.g., phone_1)"
          className="sm:w-48 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
        <input value={newValue} onChange={(e) => setNewValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="Value"
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
        <button onClick={handleAdd} disabled={saving || !newKey.trim() || !newValue.trim()}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20 shrink-0">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add
        </button>
      </div>

      <div className="space-y-2">
        {sectionItems.map((item) => (
          <div key={item.id} className="group flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
            {editingId === item.id ? (
              <>
                <span className="text-xs text-slate-500 w-28 shrink-0 font-mono">{item.key}</span>
                <input value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleUpdate(item.id)} autoFocus
                  className="flex-1 rounded-lg border border-cyan-500/30 bg-white/[0.05] px-3 py-2 text-sm text-white focus:outline-none" />
                <button onClick={() => handleUpdate(item.id)} className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"><Save className="h-3.5 w-3.5" /></button>
                <button onClick={() => setEditingId(null)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10"><X className="h-3.5 w-3.5" /></button>
              </>
            ) : (
              <>
                <span className="text-xs text-slate-500 w-28 shrink-0 font-mono">{item.key}</span>
                <span className="flex-1 text-sm text-slate-300 truncate">{item.value}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingId(item.id); setEditValue(item.value); }} className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"><Edit2 className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </>
            )}
          </div>
        ))}
        {sectionItems.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Settings className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">{searchQuery ? "No items match your search" : "No content in this section yet"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Messages Section ────────────────────────────────────────── */
function MessagesSection({ data, addToast, onRefresh, searchQuery }: { data: any[]; addToast: (type: "success" | "error" | "info", msg: string) => void; onRefresh: () => void; searchQuery: string }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
  const items = useMemo(() => {
    return searchQuery ? data.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()) || c.message.toLowerCase().includes(searchQuery.toLowerCase())) : data;
  }, [data, searchQuery]);

  const handleDelete = async (id: number) => {
    try { await deleteContactAdmin(token, id); addToast("success", "Message deleted"); onRefresh(); }
    catch { addToast("error", "Failed to delete"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{items.length} {items.length === 1 ? "message" : "messages"}</p>
      </div>

      {items.map((contact) => (
        <div key={contact.id} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold shrink-0">
                {contact.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-white text-sm font-semibold">{contact.name}</h4>
                  <span className="text-slate-600 text-xs">{contact.email}</span>
                  <span className="text-slate-700 text-[10px]">{new Date(contact.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">{contact.message}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(contact.id)}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 shrink-0">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">{searchQuery ? "No messages match your search" : "No messages yet"}</p>
        </div>
      )}
    </div>
  );
}