import { HeroSection } from "@/components/site/sections/hero-section";
import { StatsSection } from "@/components/site/sections/stats-section";
import { CTASection } from "@/components/site/sections/cta-section";

export function HomeTemplateV1({ content }: { content: Record<string, unknown> }) {
  return <main><HeroSection title={String(content.hero_title ?? "Home")} subtitle={String(content.hero_subtitle ?? "")}/><StatsSection items={(content.stats as never[]) ?? []}/><CTASection title={String(content.cta_title ?? "Ready?")} buttonLabel={String(content.cta_label ?? "Contact")} buttonHref={String(content.cta_href ?? "/contact")}/></main>;
}
