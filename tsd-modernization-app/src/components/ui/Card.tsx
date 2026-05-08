import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return (
    <As
      className={`rounded-[14px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </As>
  );
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 pt-5 pb-3 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-lg font-semibold tracking-tight text-[var(--text)] ${className}`}>
      {children}
    </h2>
  );
}
