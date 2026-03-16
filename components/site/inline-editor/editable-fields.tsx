"use client";

import { useState, useTransition } from "react";
import { savePageField } from "@/actions/cms";
import { useEditorContext } from "@/components/site/inline-editor/editor-context";

type BaseProps = {
  pageId: string;
  projectId: string;
  field: string;
};

export function EditableText({ pageId, projectId, field, value, className }: BaseProps & { value: string; className?: string }) {
  const { isEditing, actorId } = useEditorContext();
  const [current, setCurrent] = useState(value);
  const [pending, startTransition] = useTransition();

  const save = () => {
    if (!actorId) return;
    startTransition(async () => {
      await savePageField(pageId, projectId, field, current, actorId);
    });
  };

  if (!isEditing) return <>{current}</>;

  return (
    <span
      className={className}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => setCurrent(e.currentTarget.textContent ?? "")}
      onBlur={save}
      data-saving={pending ? "true" : "false"}
    >
      {current}
    </span>
  );
}

export function EditableImage({ pageId, projectId, field, src, alt, className }: BaseProps & { src: string; alt: string; className?: string }) {
  const { isEditing, actorId } = useEditorContext();
  const [current, setCurrent] = useState(src);
  const [pending, startTransition] = useTransition();

  const onFileChange = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("project_id", projectId);
    const response = await fetch("/api/media/upload", { method: "POST", body: formData });
    const json = (await response.json()) as { url?: string };
    if (!json.url) return;

    setCurrent(json.url);
    if (!actorId) return;
    startTransition(async () => {
      await savePageField(pageId, projectId, field, json.url!, actorId);
    });
  };

  if (!isEditing) return <img src={current} alt={alt} className={className} />;

  return (
    <label className="block cursor-pointer space-y-2">
      <img src={current} alt={alt} className={className} data-saving={pending ? "true" : "false"} />
      <input
        type="file"
        accept="image/*"
        className="text-xs"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void onFileChange(file);
        }}
      />
    </label>
  );
}
