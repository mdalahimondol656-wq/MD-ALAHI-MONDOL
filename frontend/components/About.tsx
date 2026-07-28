"use client";
import { useEffect, useState } from "react";
import { Brain, Heart, Eye, Lightbulb, Target, Activity, BookOpen, Users, Compass, Zap, Search, PieChart, FileText, Handshake, MessageCircle } from "lucide-react";

interface Skill {
  name: string;
  level: number;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

const skills: Skill[] = [
  { name: "Clinical Psychology", level: 95, icon: Brain, category: "Clinical" },
  { name: "Counseling Frameworks", level: 90, icon: Heart, category: "Clinical" },
  { name: "Behavioral Analysis", level: 88, icon: Eye, category: "Clinical" },
  { name: "Child Development Assessment", level: 87, icon: Activity, category: "Clinical" },
  { name: "Research Methodology", level: 92, icon: Search, category: "Research" },
  { name: "Field Data Collection", level: 91, icon: Target, category: "Research" },
  { name: "Case Studies", level: 89, icon: FileText, category: "Research" },
  { name: "Academic Reporting", level: 87, icon: PieChart, category: "Research" },
  { name: "Industrial-Organizational Psychology", level: 85, icon: Users, category: "Corporate" },
  { name: "Environmental Psychology", level: 82, icon: Compass, category: "Corporate" },
  { name: "Educational Psychology", level: 84, icon: BookOpen, category: "Corporate" },
  { name: "Positive Psychology", level: 80, icon: Zap, category: "Corporate" },
  { name: "Social Psychology", level: 83, icon: Users, category: "Corporate" },
  { name: "Cognitive Psychology", level: 86, icon: Brain, category: "Corporate" },
  { name: "Active Listening & Empathy", level: 94, icon: MessageCircle, category: "Soft Skills" },
];

const categories = ["Clinical", "Research", "Corporate", "Soft Skills"];

export default function About() {
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    const el = document.getElementById("about");
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  const filteredSkills = activeCategory === "All" ? skills : skills.filter(s => s.category === activeCategory);

  return (
    <section id="about" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950" />
      <div className="section-container relative z-10">
        <div className="fade-in-up">
          <h2 className="section-title">About <span className="glow-text">Me</span></h2>
          <p className="section-subtitle">
            Analytical and dedicated Psychology graduate with a comprehensive academic background spanning a Master of Science (M.Sc.) and a Bachelor of Science (B.Sc. Honours) from the University of Dhaka (Dhaka College). Equipped with a robust understanding of human behavior, clinical counseling frameworks, organizational dynamics, and environmental psychology.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {["All", ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${activeCategory === cat ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill, i) => (
            <div
              key={skill.name}
              className={`fade-in-up glass-card p-5 transition-all duration-500 hover:border-cyan-500/30 hover:bg-white/[0.06] ${visible ? "visible" : ""}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <skill.icon className="h-4 w-4" />
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
                <span>{skill.category}</span>
                <span>{skill.level}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
