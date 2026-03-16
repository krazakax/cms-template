import { HeroSection } from "@/components/site/sections/hero-section";
import { FAQSection } from "@/components/site/sections/faq-section";

type FAQItem = { question: string; answer: string };

function parseFaq(content: Record<string, unknown>) {
  try {
    return JSON.parse(String(content.faq_json ?? "[]")) as FAQItem[];
  } catch {
    return [];
  }
}

export function FAQTemplateV1({ content }: { content: Record<string, unknown> }) {
  return (
    <main>
      <HeroSection title={String(content.title ?? "FAQ")} subtitle={String(content.subtitle ?? "")} />
      <FAQSection items={parseFaq(content) as never[]} />
    </main>
  );
}
