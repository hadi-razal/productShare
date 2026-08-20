import AdminShell from "@/components/AdminShell";
import { Metadata } from "next";
import "../(dashboard)/dashboard.css";

export const metadata: Metadata = {
  title: "Super Admin",
  description: "View and manage all Product Share stores.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
