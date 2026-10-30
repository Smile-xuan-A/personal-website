"use client";

export function DeleteButton({
  action,
  id,
  label = "删除",
}: {
  action: (formData: FormData) => Promise<void>;
  id: number;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("确认删除？此操作不可撤销。")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="danger-btn" type="submit">
        {label}
      </button>
    </form>
  );
}