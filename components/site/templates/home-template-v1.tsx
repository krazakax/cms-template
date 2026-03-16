import { HeroSection } from "@/components/site/sections/hero-section";
import { CTASection } from "@/components/site/sections/cta-section";

export function HomeTemplateV1({ content }: { content: Record<string, unknown> }) {
  return (
    <main className="space-y-8 pb-10">
      <HeroSection title={String(content.hero_title ?? "Home")} subtitle={String(content.hero_subtitle ?? "")} />
      {content.hero_image ? <img src={String(content.hero_image)} alt="Hero" className="mx-auto w-full max-w-4xl rounded-lg border" /> : null}
      <CTASection title={String(content.cta_title ?? "Ready?")} buttonLabel={String(content.cta_label ?? "Contact")} buttonHref={String(content.cta_href ?? "/contact")} />
    </main>
  );
}
