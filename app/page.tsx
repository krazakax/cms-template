import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const buttonBaseClass =
  "inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center p-6">
      <Card className="w-full space-y-4 p-8">
        <h1 className="text-3xl font-bold tracking-tight">Next.js + Supabase CMS Starter</h1>
        <p className="text-muted-foreground">
          This is a minimal public homepage. Sign in to access the admin dashboard.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/login" className={cn(buttonBaseClass, "bg-primary text-primary-foreground")}>
            Login
          </Link>
          <Link
            href="/admin"
            className={cn(buttonBaseClass, "border border-input bg-background text-foreground")}
          >
            Go to Admin
          </Link>
        </div>
      </Card>
    </main>
  );
}
