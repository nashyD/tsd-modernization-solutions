import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors duration-150 hover:text-[#13294B]"
    >
      <ArrowLeft
        size={16}
        strokeWidth={2.25}
        className="transition-transform duration-150 group-hover:-translate-x-0.5"
        aria-hidden
      />
      {label}
    </Link>
  );
}
