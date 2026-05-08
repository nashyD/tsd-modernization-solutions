import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

const FIELD_BASE =
  "w-full rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface-2)] px-3.5 py-2.5 text-base text-[var(--text)] outline-none placeholder:text-[var(--text-subtle)] transition-colors duration-150 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 disabled:cursor-not-allowed disabled:opacity-60";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...rest }, ref) => (
    <input ref={ref} className={`${FIELD_BASE} ${className}`} {...rest} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...rest }, ref) => (
    <textarea ref={ref} className={`${FIELD_BASE} ${className}`} {...rest} />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", children, ...rest }, ref) => (
    <select ref={ref} className={`${FIELD_BASE} appearance-none pr-10 ${className}`} {...rest}>
      {children}
    </select>
  )
);
Select.displayName = "Select";

export function Label({
  htmlFor,
  children,
  hint,
  className = "",
}: {
  htmlFor?: string;
  children: ReactNode;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-[var(--text)] ${className}`}>
      {children}
      {hint && <span className="ml-1.5 font-normal text-[var(--text-subtle)]">{hint}</span>}
    </label>
  );
}

export function FieldError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-sm text-[var(--danger)]">{children}</p>;
}
