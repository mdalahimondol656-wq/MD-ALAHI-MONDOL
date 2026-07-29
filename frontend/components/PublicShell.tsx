"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollAnimations from "@/components/ScrollAnimations";
import CustomCursor from "@/components/CustomCursor";
import BackToTop from "@/components/BackToTop";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <CustomCursor />
      <ScrollAnimations />
      <Navbar />
      <main className="flex-1 md:ml-[72px]">{children}</main>
      <BackToTop />
      <Footer />
    </>
  );
}
