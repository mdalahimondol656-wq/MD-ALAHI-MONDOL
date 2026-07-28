import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollAnimations from "@/components/ScrollAnimations";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "MD ALAHI MONDOL — CV Portfolio",
  description: "Graduate Psychologist / Research Consultant — CV Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col bg-slate-950 text-slate-100 antialiased overflow-x-hidden">
        <Preloader />
        <CustomCursor />
        <ScrollAnimations />
        <Navbar />
        <main className="flex-1">{children}</main>
        <BackToTop />
        <Footer />
      </body>
    </html>
  );
}
