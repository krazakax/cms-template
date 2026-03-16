export function StatsSection({ items = [] }: { items?: Array<{ label: string; value: string }> }) {
  return <section className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">{items.map((item) => <div key={item.label} className="rounded border p-4"><p className="text-2xl font-bold">{item.value}</p><p className="text-sm">{item.label}</p></div>)}</section>;
}
