import { HeroSection } from "@/components/site/sections/hero-section";

export function ContactTemplateV1({ content }: { content: Record<string, unknown> }) {
  return (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-10">
      <HeroSection title={String(content.title ?? "Contact")} subtitle={String(content.subtitle ?? "")} />
      <div className="rounded border p-4">
        <p>Email: {String(content.email ?? "")}</p>
        <p>Phone: {String(content.phone ?? "")}</p>
      </div>
      {content.map_embed_url ? (
        <iframe src={String(content.map_embed_url)} className="h-64 w-full rounded border" loading="lazy" />
      ) : null}
    </main>
  );
}
