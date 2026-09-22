"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { StoreRecord } from "@/lib/db";

// Retain the dashboard's existing entry point while setup gets its own full page.
export default function StoreSetupModal(_props: {
  userId: string;
  store: StoreRecord;
  onComplete: (store: Partial<StoreRecord>) => void;
}) {
  void _props;
  const router = useRouter();
  useEffect(() => {
    router.replace("/onboarding");
  }, [router]);
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-white text-[#6860C9]"
      role="status"
    >
      Opening your store setup…
    </div>
  );
}
