"use client";
import { useEffect, useState } from "react";
import { Brain, Heart, Eye, Lightbulb, Target, Activity, BookOpen, Users, Compass, Zap, Search, PieChart, FileText, Handshake, MessageCircle } from "lucide-react";
import { getProfile } from "@/lib/api";

interface Skill {
  name: string;
  level: number;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Heart, Eye, Lightbulb, Target, Activity, BookOpen, Users, Compass, Zap, Search, PieChart, FileText, Handshake, MessageCircle
};

const categoryLabels: Record<string, string> = {
  "Clinical": "Clinical & Counseling",
  "Research": "Research & Analytics",
  "Corporate": "Corporate & Social",
  "Soft Skills": "Soft Skills",
};

const fallbackSkills: Skill[] = [
  { name: "Clinical Psychology", level: 75, icon: Brain, category: "Clinical" },
  { name: "Counseling Frameworks", level: 77, icon: Heart, category: "Clinical" },
  { name: "Behavioral Analysis", level: 79, icon: Eye, category: "Clinical" },
  { name: "Industrial-Organizational Psychology", level: 81, icon: Lightbulb, category: "Clinical" },
  { name: "Environmental Psychology", level: 83, icon: Target, category: "Research" },
  { name: "Child Development Assessment", level: 85, icon: Activity, category: "Research" },
  { name: "Educational Psychology", level: 87, icon: BookOpen, category: "Research" },
  { name: "Positive Psychology", level: 89, icon: Users, category: "Research" },
  { name: "Social Psychology", level: 91, icon: Compass, category: "Corporate" },
  { name: "Cognitive Psychology", level: 93, icon: Zap, category: "Corporate" },
  { name: "Field Data Collection", level: 95, icon: Search, category: "Corporate" },
  { name: "Research Methodology", level: 95, icon: PieChart, category: "Corporate" },
  { name: "Case Studies", level: 95, icon: FileText, category: "Corporate" },
  { name: "Active Listening", level: 95, icon: Handshake, category: "Soft Skills" },
  { name: "Empathy", level: 95, icon: MessageCircle, category: "Soft Skills" },
];

export default function About() {
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [bio, setBio] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    const el = document.getElementById("about");
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  useEffect(() => {
    getProfile().then((data) => {
      setBio(data.bio || "");
      const mapped = (data.skills || []).map((name: string, i: number) => ({
        name,
        level: 75 + Math.min(i * 2, 20),
        icon: Object.values(iconMap)[i % Object.values(iconMap).length],
        category: i < 4 ? "Clinical" : i < 8 ? "Research" : i < 13 ? "Corporate" : "Soft Skills",
      }));
      setSkills(mapped);
    }).catch(() => setSkills(fallbackSkills));
  }, []);

  const categories = Array.from(new Set(skills.map(s => s.category)));
  const filteredSkills = activeCategory === "All" ? skills : skills.filter(s => s.category === activeCategory);

  return (
    <section id="about" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950" />
      <div className="section-container relative z-10">
        <div className="fade-in-up">
          <h2 className="section-title">About <span className="glow-text">Me</span></h2>
          <p className="section-subtitle">
            {bio || "Analytical and dedicated Psychology graduate with a comprehensive academic background spanning a Master of Science (M.Sc.) and a Bachelor of Science (B.Sc. Honours) from the University of Dhaka (Dhaka College). Equipped with a robust understanding of human behavior, clinical counseling frameworks, organizational dynamics, and environmental psychology."}
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <button
            key="All"
            onClick={() => setActiveCategory("All")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${activeCategory === "All" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${activeCategory === cat ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"}`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill, i) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.name}
                className={`fade-in-up glass-card p-5 transition-all duration-500 hover:border-cyan-500/30 hover:bg-white/[0.06] ${visible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">{skill.name}</span>
                </div>
                <div className="skill-bar-bg">
                  <div
                    className="skill-bar-fill"
                    style={{ width: visible ? `${skill.level}%` : "0%", transitionDelay: `${i * 60 + 300}ms` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{categoryLabels[skill.category] || skill.category}</span>
                  <span>{skill.level}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}