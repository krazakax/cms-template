import { HeroSection } from "@/components/site/sections/hero-section";
import { TestimonialSection } from "@/components/site/sections/testimonial-section";
import { CTASection } from "@/components/site/sections/cta-section";

export function LandingTemplateV1({ content }: { content: Record<string, unknown> }) {
  return <main><HeroSection title={String(content.title ?? "Landing")} subtitle={String(content.subtitle ?? "")}/><TestimonialSection quote={String(content.quote ?? "Excellent results") } name={String(content.quote_author ?? "Client") }/><CTASection title={String(content.cta_title ?? "Let\'s talk")} buttonLabel={String(content.cta_label ?? "Book call")} buttonHref={String(content.cta_href ?? "/contact")}/></main>;
}
