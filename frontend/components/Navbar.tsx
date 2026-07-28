"use client";
import { useState, useEffect } from "react";
import { Home, User, GraduationCap, Zap, Mail, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const links = [
  { href: "#hero", label: "Home", icon: Home },
  { href: "#about", label: "About", icon: User },
  { href: "#experience", label: "Experience", icon: GraduationCap },
  { href: "#projects", label: "Skills", icon: Zap },
  { href: "#contact", label: "Contact", icon: Mail },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = links.map(l => l.href.substring(1));
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (current) setActiveSection(`#${current}`);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${scrolled ? "border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/30" : "border-transparent bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#hero" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
          <div className="h-8 w-8">
            <Logo />
          </div>
          <span className="glow-text">Mondol</span>
        </a>

        <button
          className="sm:hidden rounded-lg p-2 text-white hover:bg-white/10 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <ul className="hidden gap-8 sm:flex">
          {links.map((l) => {
            const Icon = l.icon;
            const isActive = activeSection === l.href;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 ${isActive ? "text-cyan-400" : "text-slate-400 hover:text-white"}`}
                >
                  <Icon className="h-4 w-4" />
                  {l.label}
                  {isActive && <span className="h-1 w-1 rounded-full bg-cyan-400" />}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {open && (
        <div className="border-t border-cyan-500/20 bg-slate-950/95 backdrop-blur-xl sm:hidden">
          <ul className="flex flex-col gap-1 px-4 py-4">
            {links.map((l) => {
              const Icon = l.icon;
              const isActive = activeSection === l.href;
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "text-cyan-400 bg-cyan-500/10 rounded-lg px-3" : "text-slate-400 hover:text-white hover:bg-white/5 rounded-lg px-3"}`}
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
  );
}