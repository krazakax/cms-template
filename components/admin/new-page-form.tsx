"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPage } from "@/actions/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewPageForm({
  actorId,
  templateOptions,
}: {
  actorId: string;
  templateOptions: { key: string; label: string }[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState(templateOptions[0]?.key ?? "home_v1");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await createPage({ title, slug, template_key: template }, actorId);
          if (result.error) {
            setMessage(result.error);
            return;
          }
          router.push(`/admin/pages/${result.id}`);
        });
      }}
    >
      <label className="block text-sm">Title<Input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
      <label className="block text-sm">Slug<Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="about" required /></label>
      <label className="block text-sm">Template
        <select value={template} onChange={(e) => setTemplate(e.target.value)} className="mt-1 w-full rounded border px-2 py-2 text-sm">
          {templateOptions.map((opt) => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
        </select>
      </label>
      <Button type="submit" disabled={pending}>{pending ? "Creating..." : "Create page"}</Button>
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
    </form>
  );
}
