import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — MD ALAHI MONDOL",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}