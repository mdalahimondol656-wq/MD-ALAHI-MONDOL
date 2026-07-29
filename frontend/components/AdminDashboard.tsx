"use client";
import { useState, useEffect } from "react";
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
  getContactsAdmin, deleteContactAdmin, adminLogout
} from "@/lib/api";

type Tab = "overview" | "profile" | "education" | "experience" | "projects" | "contacts";

interface AdminData {
  education: any[];
  experiences: any[];
  projects: any[];
  contacts: any[];
}

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

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }
    loadData(token);
  }, [router]);

  const loadData = async (token: string) => {
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
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

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
      {/* Notification */}
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

      {/* Header */}
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
        {/* Tabs */}
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

        {/* Content */}
        <div className="grid gap-6">
          {activeTab === "overview" && <OverviewTab data={data} />}
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "education" && <EducationTab data={data.education} />}
          {activeTab === "experience" && <ExperienceTab data={data.experiences} />}
          {activeTab === "projects" && <ProjectsTab data={data.projects} />}
          {activeTab === "contacts" && <ContactsTab data={data.contacts} />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ data }: { data: AdminData }) {
  const stats = [
    { label: "Education", value: data.education.length, icon: <GraduationCap className="h-5 w-5" />, color: "cyan" },
    { label: "Experience", value: data.experiences.length, icon: <Briefcase className="h-5 w-5" />, color: "blue" },
    { label: "Project Groups", value: data.projects.length, icon: <FolderOpen className="h-5 w-5" />, color: "teal" },
    { label: "Messages", value: data.contacts.length, icon: <Mail className="h-5 w-5" />, color: "cyan" },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card p-6">
          <div className={`mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border bg-${stat.color}-500/10 text-${stat.color}-400 border-${stat.color}-500/20`}>
            {stat.icon}
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-sm text-slate-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <User className="h-5 w-5 text-cyan-400" />
        Profile Settings
      </h3>
      <p className="text-slate-400 text-sm">Profile editing coming soon. Contact your developer to update profile content.</p>
    </div>
  );
}

function EducationTab({ data }: { data: any[] }) {
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ level: "", institution: "", period: "", detail: "", modules: "" });

  const handleEdit = (item: any) => {
    setEditing(item.id);
    setForm({ level: item.level, institution: item.institution, period: item.period, detail: item.detail, modules: item.modules || "" });
  };

  const handleSave = async () => {
    // Save logic here
    setEditing(null);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-cyan-400" />
          Education Management
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm">
          <Plus className="h-4 w-4" />
          Add Education
        </button>
      </div>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
            {editing === item.id ? (
              <div className="space-y-3">
                <input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Level" />
                <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Institution" />
                <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Period" />
                <textarea value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Detail" rows={2} />
                <textarea value={form.modules} onChange={(e) => setForm({ ...form, modules: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" placeholder="Modules" rows={2} />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/30">
                    <Save className="h-3 w-3" /> Save
                  </button>
                  <button onClick={() => setEditing(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10">
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
                  <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceTab({ data }: { data: any[] }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-cyan-400" />
          Experience Management
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm">
          <Plus className="h-4 w-4" />
          Add Experience
        </button>
      </div>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm mb-1">{item.role}</h4>
                <p className="text-slate-400 text-xs mb-2">{item.institution} • {item.period}</p>
                <p className="text-slate-500 text-xs">{item.detail}</p>
                {item.description && <p className="text-slate-600 text-xs mt-2 italic">{item.description}</p>}
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsTab({ data }: { data: any[] }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-cyan-400" />
          Projects & Skills Management
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm">
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((group) => (
          <div key={group.id} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold text-sm">{group.category}</h4>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
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
                    <button className="p-1 rounded text-slate-400 hover:text-cyan-400 transition-all">
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button className="p-1 rounded text-slate-400 hover:text-red-400 transition-all">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full mt-2 p-2 rounded-lg border border-dashed border-white/10 text-slate-500 text-xs hover:border-cyan-500/30 hover:text-cyan-400 transition-all flex items-center justify-center gap-1">
                <Plus className="h-3 w-3" />
                Add Item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactsTab({ data }: { data: any[] }) {
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
              <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
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