import { HeroSection } from "@/components/site/sections/hero-section";
import { RichTextSection } from "@/components/site/sections/richtext-section";
import { LogoGridSection } from "@/components/site/sections/logo-grid-section";

export function AboutTemplateV1({ content }: { content: Record<string, unknown> }) {
  return <main><HeroSection title={String(content.title ?? "About")} subtitle={String(content.subtitle ?? "")}/><RichTextSection content={String(content.body ?? "")}/><LogoGridSection logos={(content.logos as string[]) ?? []}/></main>;
}
