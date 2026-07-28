"use client";

export default function SectionDivider() {
  return (
    <div className="relative h-24 w-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-cyan-500/50 animate-pulse" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-px w-48 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-pulse" />
      </div>
    </div>
  );
}
