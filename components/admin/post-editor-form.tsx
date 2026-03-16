"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePost } from "@/actions/cms";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type PostValues = {
  id?: string;
  project_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_name: string | null;
  status: "draft" | "published";
  published_at: string | null;
};

export function PostEditorForm({ actorId, initialValues, mediaOptions }: { actorId: string; initialValues: PostValues; mediaOptions: { id: string; file_url: string; alt_text: string | null }[] }) {
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const response = await savePost(values, actorId);
          if (response.error) return setMessage(response.error);
          setMessage("Saved");
          if (!values.id && response.id) router.push(`/admin/blog/${response.id}`);
          router.refresh();
        });
      }}
    >
      <label className="block text-sm">Title<Input value={values.title} onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))} required /></label>
      <label className="block text-sm">Slug<Input value={values.slug} onChange={(e) => setValues((v) => ({ ...v, slug: e.target.value }))} required /></label>
      <label className="block text-sm">Excerpt<Textarea value={values.excerpt ?? ""} onChange={(e) => setValues((v) => ({ ...v, excerpt: e.target.value }))} /></label>
      <label className="block text-sm">Content<Textarea className="min-h-40" value={values.content} onChange={(e) => setValues((v) => ({ ...v, content: e.target.value }))} /></label>
      <label className="block text-sm">Author<Input value={values.author_name ?? ""} onChange={(e) => setValues((v) => ({ ...v, author_name: e.target.value }))} /></label>
      <label className="block text-sm">Cover image
        <select className="mt-1 w-full rounded border px-2 py-2 text-sm" value={values.cover_image_url ?? ""} onChange={(e) => setValues((v) => ({ ...v, cover_image_url: e.target.value }))}>
          <option value="">Select media</option>
          {mediaOptions.map((media) => <option key={media.id} value={media.file_url}>{media.alt_text || media.file_url}</option>)}
        </select>
        <Input className="mt-2" value={values.cover_image_url ?? ""} placeholder="Or paste image URL" onChange={(e) => setValues((v) => ({ ...v, cover_image_url: e.target.value }))} />
      </label>
      <label className="block text-sm">Status
        <select className="mt-1 w-full rounded border px-2 py-2 text-sm" value={values.status} onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as "draft" | "published" }))}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>
      <Button disabled={pending} type="submit">{pending ? "Saving..." : "Save Post"}</Button>
      {message ? <p className="text-sm">{message}</p> : null}
    </form>
  );
}
