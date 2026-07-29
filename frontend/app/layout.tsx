import type { Metadata } from "next";
import "./globals.css";
import Preloader from "@/components/Preloader";
import PublicShell from "@/components/PublicShell";

export const metadata: Metadata = {
  title: "MD ALAHI MONDOL — CV Portfolio",
  description: "Graduate Psychologist / Research Consultant — CV Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#020617" />
      </head>
      <body className="flex min-h-full flex-col bg-slate-950 text-slate-100 antialiased overflow-x-hidden">
        <Preloader />
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
