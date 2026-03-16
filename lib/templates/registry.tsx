import { AboutTemplateV1 } from "@/components/site/templates/about-template-v1";
import { ContactTemplateV1 } from "@/components/site/templates/contact-template-v1";
import { FAQTemplateV1 } from "@/components/site/templates/faq-template-v1";
import { HomeTemplateV1 } from "@/components/site/templates/home-template-v1";
import { LandingTemplateV1 } from "@/components/site/templates/landing-template-v1";

const map: Record<string, (props: { content: Record<string, unknown> }) => JSX.Element> = {
  home_v1: HomeTemplateV1,
  about_v1: AboutTemplateV1,
  contact_v1: ContactTemplateV1,
  faq_v1: FAQTemplateV1,
  landing_v1: LandingTemplateV1,
};

export function renderTemplate(templateKey: string, content: Record<string, unknown>) {
  const Component = map[templateKey] ?? HomeTemplateV1;
  return <Component content={content} />;
}
