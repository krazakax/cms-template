export function HeroSection({ title, subtitle }: { title?: string; subtitle?: string }) {
  return <section className="bg-muted px-6 py-16 text-center"><h1 className="text-4xl font-bold">{title}</h1><p className="mt-2 text-muted-foreground">{subtitle}</p></section>;
}
