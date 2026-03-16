import Link from "next/link";
export function CTASection({ title, buttonLabel, buttonHref }: { title?: string; buttonLabel?: string; buttonHref?: string }) {
  return <section className="p-10 text-center"><h2 className="text-2xl font-semibold">{title}</h2><Link href={buttonHref || "#"} className="mt-4 inline-block rounded bg-primary px-4 py-2 text-primary-foreground">{buttonLabel || "Get started"}</Link></section>;
}
