import { Metadata } from "next";
import { Page } from "@/types";

export function buildPageMetadata(page: Page): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const canonical = page.canonical_url || `${baseUrl}/${page.slug === "home" ? "" : page.slug}`;
  return {
    title: page.seo_title || page.title,
    description: page.seo_description || undefined,
    alternates: { canonical },
    robots: page.noindex ? "noindex, nofollow" : "index, follow",
    openGraph: {
      title: page.og_title || page.seo_title || page.title,
      description: page.og_description || page.seo_description || undefined,
      images: page.og_image_url ? [{ url: page.og_image_url }] : undefined,
      url: canonical,
    },
  };
}
