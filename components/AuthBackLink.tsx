import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function AuthBackLink({
  href = "/",
  label = "Back",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white sm:left-6 sm:top-6"
    >
      <FiArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
