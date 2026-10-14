"use client";

import { ErrorState, PageHeader } from "@/components/dashboard/WorkspaceUI";

export default function DashboardError({ reset }: { reset: () => void }) {
  return <div className="ds-page"><PageHeader title="Something went wrong" description="We couldn’t display this page. Try loading it again." /><ErrorState message="Your workspace is temporarily unavailable." onRetry={reset} /></div>;
}
