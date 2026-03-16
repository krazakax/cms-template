import { HeroSection } from "@/components/site/sections/hero-section";
import { FAQSection } from "@/components/site/sections/faq-section";

export function ContactTemplateV1({ content }: { content: Record<string, unknown> }) {
  return <main><HeroSection title={String(content.title ?? "Contact")} subtitle={String(content.subtitle ?? "")}/><FAQSection items={(content.faqs as never[]) ?? []}/></main>;
}
