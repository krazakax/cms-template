import { HeroSection } from "@/components/site/sections/hero-section";
import { RichTextSection } from "@/components/site/sections/richtext-section";
import { LogoGridSection } from "@/components/site/sections/logo-grid-section";

function logosFromCSV(value: unknown) {
  return String(value ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function AboutTemplateV1({ content }: { content: Record<string, unknown> }) {
  return (
    <main>
      <HeroSection title={String(content.title ?? "About")} subtitle={String(content.subtitle ?? "")} />
      {content.team_image ? <img src={String(content.team_image)} alt="Team" className="mx-auto mb-6 w-full max-w-4xl rounded-lg border" /> : null}
      <RichTextSection content={String(content.body ?? "")} />
      <LogoGridSection logos={logosFromCSV(content.logos_csv)} />
    </main>
  );
}
