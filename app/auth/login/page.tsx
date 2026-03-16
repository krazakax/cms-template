import { login } from "@/actions/auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Sign in</h1>
        {searchParams?.error ? (
          <p className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {searchParams.error}
          </p>
        ) : null}
        <form action={login} className="space-y-3">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Card>
    </main>
  );
}
