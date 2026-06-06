import DashboardShell from "@/components/DashboardShell";
import { Metadata } from "next";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Dashboard - Product Share",
  description: "Manage your store products, reviews, and settings.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
