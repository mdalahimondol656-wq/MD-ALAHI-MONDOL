"use client";
import { useEffect, useState } from "react";
import { GraduationCap, Briefcase, Award, Calendar } from "lucide-react";
import { getEducation, getExperiences } from "@/lib/api";

interface EducationItem {
  id: number;
  level: string;
  institution: string;
  period: string;
  detail: string;
  modules: string;
}

interface ExperienceItem {
  id: number;
  role: string;
  institution: string;
  period: string;
  detail: string;
  description: string;
}

const fallbackEducation: EducationItem[] = [
  { id: 1, level: "Master of Science (M.Sc.) in Psychology", institution: "University of Dhaka (Affiliated Dhaka College)", period: "2022 - 2023", detail: "Graduated March 2025 | Final CGPA: 3.10 / 4.00", modules: "Clinical & Counseling Psychology, Industrial-Organizational Psychology, Environmental Psychology, Child Development & Disabilities, Advanced Social Psychology, School Psychology" },
  { id: 2, level: "Bachelor of Science (B.Sc. Honours) in Psychology", institution: "University of Dhaka (Affiliated Dhaka College)", period: "2018 - 2019", detail: "Graduated May 2024 | Final CGPA: 2.96 / 4.00 (4th Year GPA: 2.93)", modules: "Positive Psychology, Personality Psychology, Theories of Learning, History & Systems in Psychology, Cognitive Psychology, Educational Psychology" },
  { id: 3, level: "Higher Secondary Certificate (HSC)", institution: "Lalmonirhat Govt. College, Lalmonirhat", period: "2016 - 2018", detail: "Board: Dinajpur | Group: Humanities | GPA: 3.50 / 5.00", modules: "" },
  { id: 4, level: "Secondary School Certificate (SSC)", institution: "Phulkha Adarsha High School, Kurigram", period: "2014 - 2016", detail: "Board: Dinajpur | Group: Science | GPA: 4.00 / 5.00", modules: "" },
];

const fallbackExperiences: ExperienceItem[] = [
  { id: 101, role: "Graduate Intern in Psychology Department", institution: "University of Dhaka", period: "M.Sc. Requirement", detail: "Grade: A (Excellent) | Grade Point: 3.75", description: "Applied theoretical psychological frameworks in active field settings, managed case data, and observed practical behavioral interventions." },
  { id: 102, role: "Independent Research Project", institution: "University of Dhaka", period: "Academic Project", detail: "Grade: A+ (Outstanding) | Grade Point: 4.00", description: "Formulated research methodologies, compiled field data, performed analytical reviews on behavioral subsets, and defended project findings before the academic board." },
];

export default function ExperienceTimeline({ initialEducation, initialExperiences }: { initialEducation?: EducationItem[]; initialExperiences?: ExperienceItem[] }) {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"education" | "experience">("education");
  const [education, setEducation] = useState<EducationItem[]>(initialEducation?.length ? initialEducation : []);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences?.length ? initialExperiences : []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    const el = document.getElementById("experience");
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  useEffect(() => {
    if (!initialEducation?.length) {
      getEducation().then(setEducation).catch(() => setEducation(fallbackEducation));
    }
    if (!initialExperiences?.length) {
      getExperiences().then(setExperiences).catch(() => setExperiences(fallbackExperiences));
    }
  }, [initialEducation, initialExperiences]);

  const items = activeTab === "education" ? education : experiences;

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
            {items.map((item, i) => {
              const key = activeTab === "education" ? `edu-${item.id}` : `exp-${item.id}`;
              return (
                <div
                  key={key}
                  className={`relative pl-12 fade-in-up ${visible ? "visible" : ""}`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className={`timeline-dot ${activeTab === "experience" ? "!border-blue-400 !shadow-blue-500/20" : ""}`} />
                  <div className={`glass-card p-6 transition-all duration-500 hover:border-cyan-500/30 hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${activeTab === "experience" ? "bg-blue-500/10 text-blue-400" : "bg-cyan-500/10 text-cyan-400"}`}>
                          {activeTab === "experience" ? <Briefcase className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
                        </div>
                        <div>
                          <span className={`text-xs font-semibold tracking-wide uppercase ${activeTab === "experience" ? "text-blue-400" : "text-cyan-400"}`}>
                            {"level" in item ? (item as EducationItem).level : (item as ExperienceItem).role}
                          </span>
                          <h3 className="mt-1 text-base font-bold text-white">{"institution" in item ? (item as EducationItem).institution : (item as ExperienceItem).institution}</h3>
                          <p className="mt-1 text-sm text-slate-400 flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {item.period}
                          </p>
                        </div>
                      </div>
                      <div className={`flex shrink-0 items-center gap-2 rounded-full ${activeTab === "experience" ? "bg-blue-500/10" : "bg-cyan-500/10"} px-3 py-1.5`}>
                        <span className={`text-xs font-bold ${activeTab === "experience" ? "text-blue-400" : "text-cyan-400"}`}>
                          {activeTab === "education" ? "●" : "●"}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">{item.detail}</p>
                    {"modules" in item && (item as EducationItem).modules && (
                      <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4">
                        <p className="text-xs leading-relaxed text-slate-400">
                          <span className="font-semibold text-slate-300">Focus Areas: </span>
                          {(item as EducationItem).modules}
                        </p>
                      </div>
                    )}
                    {"description" in item && (item as ExperienceItem).description && (
                      <p className="mt-3 text-sm leading-relaxed text-slate-400">{(item as ExperienceItem).description}</p>
                    )}
                  </div>
                </div>
              );
            })}
            {items.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <p>No items found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
