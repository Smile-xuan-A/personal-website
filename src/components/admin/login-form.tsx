"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/lib/types";

export function LoginForm({
  action,
  next,
}: {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  next: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="login-form">
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="password">访问口令</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          placeholder="输入后台口令"
        />
      </div>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "验证中…" : "进入后台"}
      </button>
      {state && !state.ok ? <p className="form-message err">× {state.error}</p> : null}
    </form>
  );
}
