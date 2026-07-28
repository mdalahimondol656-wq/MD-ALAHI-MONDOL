"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="relative mx-auto mb-4 h-20 w-20">
          <div className="absolute inset-0 rounded-2xl border-2 border-cyan-500/30 animate-ping" />
          <div className="absolute inset-2 rounded-xl border-2 border-cyan-400/50 animate-pulse" />
          <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 animate-pulse-glow" />
        </div>
        <p className="text-sm font-semibold text-cyan-400 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
