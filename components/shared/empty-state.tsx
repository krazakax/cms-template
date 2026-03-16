export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-lg border border-dashed p-8 text-center"><h3 className="font-semibold">{title}</h3><p className="text-sm text-muted-foreground">{description}</p></div>;
}
