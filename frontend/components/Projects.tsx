"use client";
import { useEffect, useState } from "react";
import { Brain, Search, Users, Briefcase, Star, Target, BarChart3, FileText, Handshake, Activity, Compass, BookOpen, Lightbulb, Zap, Eye, Award } from "lucide-react";
import { getProjects } from "@/lib/api";

interface ProjectItem {
  id: number;
  title: string;
  desc: string;
}

interface ProjectGroup {
  category: string;
  color: string;
  icon: string;
  items: ProjectItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Search, Users, Briefcase, Star, Target, BarChart3, FileText, Handshake, Activity, Compass, BookOpen, Lightbulb, Zap, Eye, Award
};

export default function Projects() {
  const [visible, setVisible] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    const el = document.getElementById("projects");
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  useEffect(() => {
    getProjects().then((data) => {
      const groups: ProjectGroup[] = Object.entries(data).map(([category, items], i) => ({
        category,
        color: ["cyan", "blue", "teal"][i % 3],
        icon: Object.keys(iconMap)[i % Object.keys(iconMap).length],
        items: (items as ProjectItem[]).map((item, j) => ({ ...item, id: i * 100 + j })),
      }));
      setProjectGroups(groups);
    }).catch(() => {});
  }, []);

  const colorMap: Record<string, string> = {
    cyan: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 hover:border-cyan-400/40",
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20 hover:border-blue-400/40",
    teal: "from-teal-500/20 to-teal-600/5 border-teal-500/20 hover:border-teal-400/40",
  };

  const textColorMap: Record<string, string> = {
    cyan: "text-cyan-400",
    blue: "text-blue-400",
    teal: "text-teal-400",
  };

  const dotColorMap: Record<string, string> = {
    cyan: "bg-cyan-400 shadow-cyan-500/50",
    blue: "bg-blue-400 shadow-blue-500/50",
    teal: "bg-teal-400 shadow-teal-500/50",
  };

  return (
    <section id="projects" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950" />
      <div className="section-container relative z-10">
        <div className="fade-in-up">
          <h2 className="section-title">Skills & <span className="glow-text">Competencies</span></h2>
          <p className="section-subtitle">A comprehensive skill set spanning clinical, research, and corporate psychology domains.</p>
        </div>

        <div className="mt-16 space-y-16">
          {projectGroups.map((group, i) => {
            const GroupIcon = iconMap[group.icon] || Star;
            return (
              <div key={i}>
                <h3 className={`mb-8 flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest ${textColorMap[group.color]}`}>
                  <GroupIcon className="h-5 w-5" />
                  {group.category}
                </h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item, j) => {
                    const cardIndex = i * 3 + j;
                    const isExpanded = expandedCard === cardIndex;
                    return (
                      <div
                        key={item.id}
                        className={`fade-in-up glass-card p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 cursor-pointer ${visible ? "visible" : ""} ${isExpanded ? "border-cyan-500/40 bg-white/[0.06]" : ""}`}
                        style={{ transitionDelay: `${(i * 3 + j) * 100}ms` }}
                        onClick={() => setExpandedCard(isExpanded ? null : cardIndex)}
                      >
                        <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colorMap[group.color]} text-lg`}>
                          <GroupIcon className="h-5 w-5" />
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-bold text-white flex-1">{item.title}</h4>
                          <span className={`mt-0.5 h-2 w-2 rounded-full ${dotColorMap[group.color]} shadow-lg`} />
                        </div>
                        <p className={`mt-2 text-sm leading-relaxed text-slate-400 transition-all duration-300 ${isExpanded ? "" : "line-clamp-2"}`}>{item.desc}</p>
                        <div className={`mt-3 flex items-center gap-1 text-xs text-cyan-400 transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
                          <span className="font-medium">Click to collapse</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 fade-in-up glass-card p-8 glow-teal">
          <h3 className="text-center text-lg font-bold text-white mb-2">Soft Skills</h3>
          <p className="text-center text-sm text-slate-400 mb-6">Interpersonal and cognitive abilities that complement my technical expertise</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Active Listening", "Empathy", "Analytical Thinking", "Verbal Communication (Viva Voce: B+ / A)", "Academic Presentation", "Team Collaboration", "Critical Thinking", "Verbal Reasoning"].map((s) => (
              <span key={s} className="skill-tag">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}