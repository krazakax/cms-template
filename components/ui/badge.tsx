export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">{children}</span>;
}
