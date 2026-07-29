"use client";
import { useState, useEffect } from "react";
import { Home, User, GraduationCap, Zap, Mail, Menu, X, ArrowUp } from "lucide-react";
import Logo from "@/components/Logo";

const links = [
  { href: "#hero", label: "Home", icon: Home },
  { href: "#about", label: "About", icon: User },
  { href: "#experience", label: "Experience", icon: GraduationCap },
  { href: "#projects", label: "Skills", icon: Zap },
  { href: "#contact", label: "Contact", icon: Mail },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = links.map((l) => l.href.substring(1));
      const current = sections.find((section) => {
        const el = document.getElementById(section);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      });
      if (current) setActiveSection(`#${current}`);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── Mobile Top Bar ─────────────────────────────── */}
      <nav
        className={`fixed top-0 z-50 w-full border-b transition-all duration-300 md:hidden ${
          scrolled
            ? "border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/30"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="#hero" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
            <div className="h-8 w-8">
              <Logo />
            </div>
            <span className="glow-text">Mondol</span>
          </a>

          <button
            className="rounded-lg p-2 text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-cyan-500/20 bg-slate-950/95 backdrop-blur-xl">
            <ul className="flex flex-col gap-1 px-4 py-4">
              {links.map((l) => {
                const Icon = l.icon;
                const isActive = activeSection === l.href;
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 py-2.5 text-sm font-medium transition-colors rounded-lg px-3 ${
                        isActive
                          ? "text-cyan-400 bg-cyan-500/10"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* ── Desktop Left Sidebar ────────────────────────── */}
      <nav
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`fixed left-0 top-0 z-50 hidden h-full transition-all duration-300 md:flex md:flex-col ${
          hovered ? "w-52" : "w-[72px]"
        } ${scrolled ? "bg-slate-950/80 backdrop-blur-xl border-r border-cyan-500/10 shadow-xl shadow-black/20" : "bg-transparent border-r border-transparent"}`}
      >
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-3 px-5 pt-6 pb-4 transition-all duration-300"
        >
          <div className="h-9 w-9 shrink-0">
            <Logo />
          </div>
          <span
            className={`glow-text text-lg font-bold tracking-tight whitespace-nowrap transition-all duration-300 ${
              hovered ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            Mondol
          </span>
        </a>

        {/* Divider */}
        <div className="mx-4 mb-2 border-t border-cyan-500/10" />

        {/* Nav Links */}
        <ul className="flex flex-1 flex-col gap-1 px-3">
          {links.map((l) => {
            const Icon = l.icon;
            const isActive = activeSection === l.href;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  title={l.label}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-cyan-400 bg-cyan-500/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-cyan-400" />
                  )}

                  <Icon className="h-[18px] w-[18px] shrink-0" />

                  <span
                    className={`whitespace-nowrap transition-all duration-300 ${
                      hovered ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                    }`}
                  >
                    {l.label}
                  </span>

                  {/* Tooltip when collapsed */}
                  {!hovered && (
                    <span className="pointer-events-none absolute left-full ml-3 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 whitespace-nowrap z-50">
                      {l.label}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Bottom section */}
        <div className="px-3 pb-6">
          <div className="mx-1 mb-3 border-t border-cyan-500/10" />

          {/* Scroll to top */}
          <a
            href="#hero"
            title="Back to top"
            className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:text-cyan-400 hover:bg-cyan-500/10"
          >
            <ArrowUp className="h-[18px] w-[18px] shrink-0" />
            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                hovered ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              }`}
            >
              Back to top
            </span>
            {!hovered && (
              <span className="pointer-events-none absolute left-full ml-3 rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 whitespace-nowrap z-50">
                Back to top
              </span>
            )}
          </a>
        </div>
      </nav>
    </>
  );
}
