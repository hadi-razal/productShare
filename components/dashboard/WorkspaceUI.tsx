import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Check, CircleAlert, type LucideIcon } from "lucide-react";

export function PageHeader({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return <div className="ps-page-header"><div><h1>{title}</h1><p>{description}</p></div><div className="ps-header-actions">{children}</div></div>;
}

export function QuickActionCard({ href, icon: Icon, title, description }: { href: string; icon: LucideIcon; title: string; description: string }) {
  return <Link href={href} className="ps-quick-action"><Icon size={20} /><strong>{title}</strong><p>{description}</p><ArrowUpRight size={16} /></Link>;
}

export function SetupTaskCard({ href, title, description, complete }: { href: string; title: string; description: string; complete: boolean }) {
  return <Link href={href} className={`ps-setup-task ${complete ? "is-complete" : ""}`}><span className="ps-task-check">{complete ? <Check size={16} /> : <ArrowUpRight size={16} />}</span><div><strong>{title}</strong><p>{description}</p></div><span>{complete ? "Complete" : "Get started"}</span></Link>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className="ps-error" role="alert"><CircleAlert size={20} /><p>{message}</p><button type="button" className="ds-catalog-btn" onClick={onRetry}>Try again</button></div>;
}
