import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-[var(--primary-bg)] text-[var(--primary-fg)] shadow-sm hover:bg-[var(--primary-bg-hover)] active:scale-[0.98]",
  secondary:
    "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-[0.98]",
  ghost:
    "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] active:scale-[0.98]",
  danger:
    "bg-[var(--danger)] text-white hover:opacity-90 active:scale-[0.98]",
};

const SIZE: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap transition-all duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", leftIcon, rightIcon, className = "", children, ...rest }, ref) => (
    <button
      ref={ref}
      className={`${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
);
Button.displayName = "Button";

interface LinkButtonProps {
  href: string;
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  children: ReactNode;
  target?: string;
  rel?: string;
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  className = "",
  children,
  target,
  rel,
}: LinkButtonProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const Component = isExternal ? "a" : Link;
  return (
    <Component
      href={href}
      target={target}
      rel={rel}
      className={`${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </Component>
  );
}
