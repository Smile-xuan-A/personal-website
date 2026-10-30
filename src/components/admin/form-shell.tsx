"use client";

import { useActionState, type ReactNode } from "react";
import type { ActionResult } from "@/lib/types";

export function FormShell({
  action,
  submitLabel,
  children,
}: {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  submitLabel: string;
  children: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction}>
      {children}
      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "保存中…" : submitLabel}
        </button>
        {state ? (
          state.ok ? (
            <span className="form-message ok">✓ {state.message}</span>
          ) : (
            <span className="form-message err">× {state.error}</span>
          )
        ) : null}
      </div>
    </form>
  );
}