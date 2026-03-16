"use client";

import { useEffect } from "react";

const RELOAD_KEY = "__cms_chunk_reload_attempted";

function shouldReloadForError(reason: unknown): boolean {
  const message =
    reason instanceof Error
      ? reason.message
      : typeof reason === "string"
        ? reason
        : "";

  if (!message) return false;

  return (
    message.includes("ChunkLoadError") ||
    message.includes("Loading chunk") ||
    message.includes("Failed to fetch dynamically imported module")
  );
}

export function ChunkReloadHandler() {
  useEffect(() => {
    const reloadOnce = () => {
      if (sessionStorage.getItem(RELOAD_KEY)) return;
      sessionStorage.setItem(RELOAD_KEY, "1");
      window.location.reload();
    };

    const handleError = (event: ErrorEvent) => {
      if (shouldReloadForError(event.error ?? event.message)) reloadOnce();
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (shouldReloadForError(event.reason)) reloadOnce();
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
