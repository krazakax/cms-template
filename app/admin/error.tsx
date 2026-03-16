"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-4 rounded border border-destructive/40 bg-destructive/5 p-6 text-sm">
      <h2 className="text-lg font-semibold">Could not load the admin page</h2>
      <p>
        This can happen right after a new deployment if your browser still has stale JavaScript cached.
        Try refreshing once.
      </p>
      {error.digest ? (
        <p className="text-muted-foreground">Error digest: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="rounded bg-primary px-3 py-1.5 text-primary-foreground"
      >
        Retry
      </button>
    </div>
  );
}
