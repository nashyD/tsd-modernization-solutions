import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

const FIELD_BASE =
  "w-full rounded-[10px] border border-zinc-300 bg-white px-3.5 py-2.5 text-base text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 transition-colors duration-150 focus:border-[#4B9CD3] focus:ring-2 focus:ring-[#4B9CD3]/30 disabled:cursor-not-allowed disabled:opacity-60";

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
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-zinc-800 ${className}`}>
      {children}
      {hint && <span className="ml-1.5 font-normal text-zinc-400">{hint}</span>}
    </label>
  );
}

export function FieldError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-sm text-[#b91c1c]">{children}</p>;
}
