"use client";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "./Button";
import type { ComponentProps } from "react";

/**
 * Submit button for server-action <form>s. Reads the form's pending state via
 * useFormStatus and shows a spinner + disabled state on submit, so a rep on a
 * slow connection gets feedback that their tap registered. Drop-in replacement
 * for `<Button type="submit">…</Button>` inside a form.
 */
export function SubmitButton({
  children,
  pendingText,
  ...rest
}: ComponentProps<typeof Button> & { pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || rest.disabled}
      leftIcon={pending ? <Loader2 size={16} className="animate-spin" /> : rest.leftIcon}
      {...rest}
    >
      {pending ? pendingText ?? children : children}
    </Button>
  );
}
