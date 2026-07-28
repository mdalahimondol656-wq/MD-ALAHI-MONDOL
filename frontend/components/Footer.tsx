"use client";
import { GitBranch, Mail, Heart, ExternalLink, ArrowUp, Phone, Camera } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-cyan-500/10 bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/20 to-transparent" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-12 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5">
            <Logo />
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} MD ALAHI MONDOL. Crafted with <Heart className="mx-1 inline h-3 w-3 text-red-400" />
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex gap-4">
            <a href="https://www.instagram.com/mdalahimondol" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-white" aria-label="Instagram">
              <Camera className="h-4 w-4" />
              Instagram
            </a>
            <a href="https://www.linkedin.com/in/md-alahi-914b13285" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-white" aria-label="LinkedIn">
              <ExternalLink className="h-4 w-4" />
              LinkedIn
            </a>
            <a href="https://github.com/mdalahimondol" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-white" aria-label="GitHub">
              <GitBranch className="h-4 w-4" />
              GitHub
            </a>
            <a href="mailto:mondolmdalahe1880@gmail.com" className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-white" aria-label="Email">
              <Mail className="h-4 w-4" />
              Email
            </a>
          </div>
          <button
            onClick={scrollToTop}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}