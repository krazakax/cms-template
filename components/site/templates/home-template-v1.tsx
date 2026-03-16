import { HeroSection } from "@/components/site/sections/hero-section";
import { CTASection } from "@/components/site/sections/cta-section";
import { EditableImage, EditableText } from "@/components/site/inline-editor/editable-fields";

export function HomeTemplateV1({ content, pageId, projectId }: { content: Record<string, unknown>; pageId?: string; projectId?: string }) {
  const heroTitle = String(content.hero_title ?? "Home");
  const heroSubtitle = String(content.hero_subtitle ?? "");
  const ctaTitle = String(content.cta_title ?? "Ready?");
  const ctaLabel = String(content.cta_label ?? "Contact");
  const ctaHref = String(content.cta_href ?? "/contact");
  const heroImage = content.hero_image ? String(content.hero_image) : "";

  return (
    <main className="space-y-8 pb-10">
      {pageId && projectId ? (
        <section className="mx-auto max-w-5xl space-y-2 px-4 pt-8">
          <h1 className="text-3xl font-bold">
            <EditableText pageId={pageId} projectId={projectId} field="hero_title" value={heroTitle} />
          </h1>
          <p className="text-muted-foreground">
            <EditableText pageId={pageId} projectId={projectId} field="hero_subtitle" value={heroSubtitle} />
          </p>
        </section>
      ) : (
        <HeroSection title={heroTitle} subtitle={heroSubtitle} />
      )}
      {heroImage && pageId && projectId ? (
        <EditableImage pageId={pageId} projectId={projectId} field="hero_image" src={heroImage} alt="Hero" className="mx-auto w-full max-w-4xl rounded-lg border" />
      ) : heroImage ? (
        <img src={heroImage} alt="Hero" className="mx-auto w-full max-w-4xl rounded-lg border" />
      ) : null}
      {pageId && projectId ? (
        <section className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-semibold">
            <EditableText pageId={pageId} projectId={projectId} field="cta_title" value={ctaTitle} />
          </h2>
          <a href={ctaHref} className="inline-block rounded bg-primary px-4 py-2 text-white">
            <EditableText pageId={pageId} projectId={projectId} field="cta_label" value={ctaLabel} />
          </a>
        </section>
      ) : (
        <CTASection title={ctaTitle} buttonLabel={ctaLabel} buttonHref={ctaHref} />
      )}
    </main>
  );
}
