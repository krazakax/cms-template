"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SchemaFieldRenderer } from "@/components/admin/schema-field-renderer";
import { savePage } from "@/actions/cms";
import { slugify } from "@/lib/utils";
import { TemplateField } from "@/types";

const schema = z.object({
  id: z.string(), project_id: z.string(), title: z.string().min(2), slug: z.string().min(1), status: z.enum(["draft", "published"]),
  page_content: z.record(z.any()), seo_title: z.string().nullable(), seo_description: z.string().nullable(),
  og_title: z.string().nullable(), og_description: z.string().nullable(), og_image_url: z.string().nullable(),
  canonical_url: z.string().nullable(), noindex: z.boolean(), published_at: z.string().nullable()
});

type Values = z.infer<typeof schema>;

export function PageEditorForm({
  initialValues,
  actorId,
  fields,
  mediaOptions,
}: {
  initialValues: Values;
  actorId: string;
  fields: TemplateField[];
  mediaOptions: { id: string; file_url: string; alt_text: string | null }[];
}) {
  const [activeTab, setActiveTab] = useState("content");
  const [result, setResult] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: initialValues });

  const onSubmit = (values: Values) => startTransition(async () => {
    const response = await savePage(values, actorId);
    setResult(response.error ? `Error: ${response.error}` : "Saved successfully");
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-2 text-sm">{["content","seo","social","settings"].map((tab) => <button type="button" key={tab} onClick={() => setActiveTab(tab)} className={`rounded px-3 py-1 ${activeTab===tab?"bg-primary text-white":"bg-muted"}`}>{tab}</button>)}</div>
      <label className="block"><span className="text-sm">Title</span><Input {...form.register("title", { onChange: (e) => form.setValue("slug", slugify(e.target.value)) })} /></label>
      <label className="block"><span className="text-sm">Slug</span><Input {...form.register("slug")} /></label>
      {activeTab === "content" && <SchemaFieldRenderer fields={fields} register={form.register as never} watch={form.watch as never} setValue={form.setValue as never} parentKey="page_content" mediaOptions={mediaOptions} />}
      {activeTab === "seo" && <div className="space-y-2"><Input placeholder="SEO title" {...form.register("seo_title")} /><Textarea placeholder="SEO description" {...form.register("seo_description")} /></div>}
      {activeTab === "social" && <div className="space-y-2"><Input placeholder="OG title" {...form.register("og_title")} /><Textarea placeholder="OG description" {...form.register("og_description")} /><Input placeholder="OG image URL" {...form.register("og_image_url")} /></div>}
      {activeTab === "settings" && <div className="space-y-2"><Input placeholder="Canonical URL" {...form.register("canonical_url")} /><label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("noindex")} />Noindex</label><select className="rounded border px-2 py-1" {...form.register("status")}><option value="draft">Draft</option><option value="published">Published</option></select></div>}
      <Button disabled={pending} type="submit">{pending ? "Saving..." : "Save"}</Button>
      {result && <p className="text-sm">{result}</p>}
    </form>
  );
}
