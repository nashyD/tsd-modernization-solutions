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
      className={`rounded-[14px] border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgb(15_23_42_/_0.04)] ${className}`}
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
    <h2 className={`text-lg font-semibold tracking-tight text-[#13294B] ${className}`}>
      {children}
    </h2>
  );
}
