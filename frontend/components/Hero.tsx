"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Sparkles, ChevronDown, Download, Mail } from "lucide-react";
import { getProfile } from "@/lib/api";

interface Profile {
  name: string;
  title: string;
  tagline: string;
  location: string;
  bio: string;
  skills: string[];
}

function FloatingOrb({ delay, size, color, top, left }: { delay: number; size: string; color: string; top: string; left: string }) {
  return (
    <div
      className={`absolute rounded-full ${size} ${color} animate-float opacity-20`}
      style={{ top, left, animationDelay: `${delay}s`, filter: "blur(60px)" }}
    />
  );
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setLoaded(true);
    setTimeout(() => setShowContent(true), 200);
    getProfile().then(setProfile).catch(() => {});
  }, []);

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/50 to-slate-950" />
        <FloatingOrb delay={0} size="w-96 h-96" color="bg-cyan-600" top="10%" left="10%" />
        <FloatingOrb delay={2} size="w-80 h-80" color="bg-blue-600" top="60%" left="70%" />
        <FloatingOrb delay={4} size="w-72 h-72" color="bg-cyan-600" top="30%" left="80%" />
        <FloatingOrb delay={1} size="w-64 h-64" color="bg-cyan-700" top="70%" left="20%" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      <div className={`section-container text-center relative z-10 transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="group relative mx-auto mb-12 h-52 w-52">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/40 to-blue-600/40 blur-xl opacity-60 animate-bioluminescent" />
          <div className="relative h-full w-full rounded-3xl border-2 border-cyan-400/60 bg-gradient-to-br from-blue-950 via-cyan-950 to-slate-950 shadow-2xl shadow-cyan-500/30">
            <div className="absolute inset-0 rounded-2xl border border-cyan-300/20 pointer-events-none animate-caustics" />
            <div className="absolute -inset-8 rounded-3xl border border-cyan-500/10 pointer-events-none animate-pulse-glow" style={{ outlineOffset: '2rem' }} />
            <div className="absolute inset-2 rounded-2xl overflow-hidden">
              <Image
                src="/profile.jpeg"
                alt={profile?.name || "MD ALAHI MONDOL"}
                fill
                className="rounded-2xl object-cover transition-all duration-700 brightness-90 contrast-110 saturate-75 group-hover:brightness-100 group-hover:contrast-100 group-hover:saturate-100"
                priority
                sizes="(max-width: 768px) 208px, 208px"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-blue-950/30 to-slate-950/50 mix-blend-multiply pointer-events-none transition-all duration-700 group-hover:opacity-0" />
            </div>
          </div>
        </div>

        <div className={`transition-all duration-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-400 backdrop-blur border border-cyan-500/20">
            <Sparkles className="h-3 w-3" />
            <span>Available for Opportunities</span>
          </div>

          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            {profile?.name?.split(" ").slice(0, 2).join(" ") || "MD ALAHI"}{" "}
            <span className="glow-text">{profile?.name?.split(" ").slice(2).join(" ") || "MONDOL"}</span>
          </h1>

          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
            <p className="text-xl font-semibold text-cyan-400 sm:text-2xl lg:text-3xl">
              {profile?.title || "Graduate Psychologist / Research Consultant"}
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-400 italic leading-relaxed">
            &ldquo;{profile?.tagline || "Bridging academic excellence in Psychology with data-driven behavioral insights."}&rdquo;
          </p>

          <div className="mb-10 flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-500" />
              <span>{profile?.location || "Kurigram / Dhaka, Bangladesh"}</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <span>Available for opportunities</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#contact" className="btn-primary group" data-magnetic>
              Get in Touch
              <ArrowRight className="ml-2 inline h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#about" className="btn-secondary group" data-magnetic>
              Explore More
            </a>
            <a href="/Md_Alahi_MondolCV.pdf" target="_blank" rel="noopener noreferrer" className="btn-secondary group flex items-center gap-2" data-magnetic>
              <Download className="h-4 w-4" />
              Download CV
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-cyan-500/50" />
        </div>
      </div>
    </section>
  );
}