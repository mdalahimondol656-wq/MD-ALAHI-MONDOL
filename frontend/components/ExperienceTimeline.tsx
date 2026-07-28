"use client";
import { useEffect, useState } from "react";
import { GraduationCap, Briefcase, Award, Calendar, TrendingUp, Activity } from "lucide-react";

const education = [
  {
    level: "Master of Science (M.Sc.) in Psychology",
    institution: "University of Dhaka (Affiliated Dhaka College)",
    period: "2022 - 2023",
    detail: "Graduated March 2025 | Final CGPA: 3.10 / 4.00",
    grade: "A",
    gradePoint: "3.10",
    icon: GraduationCap,
    modules: "Clinical & Counseling Psychology, Industrial-Organizational Psychology, Environmental Psychology, Child Development & Disabilities, Advanced Social Psychology, School Psychology",
  },
  {
    level: "Bachelor of Science (B.Sc. Honours) in Psychology",
    institution: "University of Dhaka (Affiliated Dhaka College)",
    period: "2018 - 2019",
    detail: "Graduated May 2024 | Final CGPA: 2.96 / 4.00 (4th Year: 2.93)",
    grade: "A",
    gradePoint: "2.96",
    icon: GraduationCap,
    modules: "Positive Psychology, Personality Psychology, Theories of Learning, History & Systems in Psychology, Cognitive Psychology, Educational Psychology",
  },
  {
    level: "Higher Secondary Certificate (HSC)",
    institution: "Lalmonirhat Govt. College, Lalmonirhat",
    period: "2016 - 2018",
    detail: "Board: Dinajpur | Group: Humanities | GPA: 3.50 / 5.00",
    grade: "A",
    gradePoint: "3.50",
    icon: Award,
    modules: "",
  },
  {
    level: "Secondary School Certificate (SSC)",
    institution: "Phulkha Adarsha High School, Kurigram",
    period: "2014 - 2016",
    detail: "Board: Dinajpur | Group: Science | GPA: 4.00 / 5.00",
    grade: "A+",
    gradePoint: "4.00",
    icon: Award,
    modules: "",
  },
];

const experiences = [
  {
    role: "Clinic Operation & Business Development Manager",
    institution: "Surjer Hashi Clinic — West Razabazar",
    period: "01-10-2025 — Present",
    detail: "Leading clinic operations and business development strategy",
    icon: TrendingUp,
    description: "Overseeing daily clinic operations, driving business growth strategies, managing client relationships, and ensuring quality service delivery in a clinical psychology setting.",
  },
  {
    role: "Junior Officer — Complaints & Audit",
    institution: "Surjer Hashi Network",
    period: "21-04-2024 — 30-09-2025",
    detail: "Grade: A — Proven track record in audit and compliance",
    icon: Activity,
    description: "Managed complaint resolution processes, conducted internal audits, ensured regulatory compliance, and contributed to process improvement initiatives across the network.",
  },
];

export default function ExperienceTimeline() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"education" | "experience">("education");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    const el = document.getElementById("experience");
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <section id="experience" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950" />
      <div className="section-container relative z-10">
        <div className="fade-in-up">
          <h2 className="section-title">Education & <span className="glow-text">Experience</span></h2>
          <p className="section-subtitle">Academic journey and hands-on professional experience shaping my expertise.</p>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <button
            onClick={() => setActiveTab("education")}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${activeTab === "education" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10" : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"}`}
          >
            <GraduationCap className="inline h-4 w-4 mr-2" />
            Education
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${activeTab === "experience" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10" : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"}`}
          >
            <Briefcase className="inline h-4 w-4 mr-2" />
            Experience
          </button>
        </div>

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="timeline-line" />
          <div className="space-y-10">
            {(activeTab === "education" ? education : experiences).map((item, i) => (
              <div
                key={i}
                className={`relative pl-12 fade-in-up ${visible ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className={`timeline-dot ${activeTab === "experience" ? "!border-blue-400 !shadow-blue-500/20" : ""}`} />
                <div className={`glass-card p-6 transition-all duration-500 hover:border-cyan-500/30 hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${activeTab === "experience" ? "bg-blue-500/10 text-blue-400" : "bg-cyan-500/10 text-cyan-400"}`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className={`text-xs font-semibold tracking-wide uppercase ${activeTab === "experience" ? "text-blue-400" : "text-cyan-400"}`}>
                          {"level" in item ? (item as typeof education[0]).level : (item as typeof experiences[0]).role}
                        </span>
                        <h3 className="mt-1 text-base font-bold text-white">{"institution" in item ? (item as typeof education[0]).institution : (item as typeof experiences[0]).institution}</h3>
                        <p className="mt-1 text-sm text-slate-400 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {item.period}
                        </p>
                      </div>
                    </div>
                    <div className={`flex shrink-0 items-center gap-2 rounded-full ${activeTab === "experience" ? "bg-blue-500/10" : "bg-cyan-500/10"} px-3 py-1.5`}>
                      <span className={`text-xs font-bold ${activeTab === "experience" ? "text-blue-400" : "text-cyan-400"}`}>
                        {"grade" in item ? (item as typeof education[0]).grade : "●"}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-400">{item.detail}</p>
                  {"modules" in item && (item as typeof education[0]).modules && (
                    <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4">
                      <p className="text-xs leading-relaxed text-slate-400">
                        <span className="font-semibold text-slate-300">Focus Areas: </span>
                        {(item as typeof education[0]).modules}
                      </p>
                    </div>
                  )}
                  {"description" in item && (item as typeof experiences[0]).description && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{(item as typeof experiences[0]).description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}