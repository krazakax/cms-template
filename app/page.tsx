import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center p-6">
      <Card className="w-full space-y-4 p-8">
        <h1 className="text-3xl font-bold tracking-tight">Next.js + Supabase CMS Starter</h1>
        <p className="text-muted-foreground">
          This is a minimal public homepage. Sign in to access the admin dashboard.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">Go to Admin</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
