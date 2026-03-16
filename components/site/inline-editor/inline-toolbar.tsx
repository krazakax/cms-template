"use client";

import { useEditorContext } from "@/components/site/inline-editor/editor-context";
import { logout } from "@/actions/auth";

export function InlineToolbar({ isSaving }: { isSaving?: boolean }) {
  const { isEditing } = useEditorContext();
  if (!isEditing) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full border bg-white px-4 py-2 text-xs shadow">
      <span className={isSaving ? "text-amber-600" : "text-emerald-600"}>{isSaving ? "Saving…" : "Editor mode"}</span>
      <form action={logout}>
        <button type="submit" className="underline">Logout</button>
      </form>
    </div>
  );
}
