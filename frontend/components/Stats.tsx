"use client";
import { useEffect, useState, useRef } from "react";
import { GraduationCap, Briefcase, Award, TrendingUp } from "lucide-react";

const stats = [
  { label: "CGPA", value: 3.10, suffix: "/4.00", icon: GraduationCap, color: "cyan" as const },
  { label: "Experience", value: 2, suffix: "+ Years", icon: Briefcase, color: "blue" as const },
  { label: "Projects", value: 10, suffix: "+", icon: Award, color: "teal" as const },
  { label: "Skills", value: 15, suffix: "+", icon: TrendingUp, color: "cyan" as const },
];

const colorMap = {
  cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  teal: "text-teal-400 bg-teal-500/10 border-teal-500/20",
};

export default function Stats() {
  const [visible, setVisible] = useState(false);
  const countersRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    const el = document.getElementById("stats");
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 1500;
    const startTime = performance.now();
    const targets = stats.map(s => s.value);

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      stats.forEach((s, i) => {
        const current = s.value * eased;
        countersRef.current[s.label] = current;
      });
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }, [visible]);

  return (
    <section id="stats" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/20 to-slate-950" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      <div className="section-container relative z-10">
        <div className="fade-in-up">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              const current = countersRef.current[stat.label] ?? 0;
              return (
                <div
                  key={stat.label}
                  className={`fade-in-up glass-card p-6 text-center transition-all duration-500 hover:border-teal-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 ${visible ? "visible" : ""}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className={`mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${colorMap[stat.color]}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value % 1 !== 0 ? current.toFixed(2) : Math.round(current)}
                    <span className="text-lg text-slate-400">{stat.suffix}</span>
                  </div>
                  <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
