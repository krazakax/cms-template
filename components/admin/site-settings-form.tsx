"use client";

import { useState, useTransition } from "react";
import { saveSiteSettings } from "@/actions/cms";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type SettingsValues = {
  id?: string;
  site_title: string;
  logo_url: string | null;
  footer_content: string | null;
  nav_menu: string;
};

function isValidNavMenu(input: unknown): input is { label: string; href: string }[] {
  return (
    Array.isArray(input) &&
    input.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as { label?: unknown }).label === "string" &&
        (item as { label: string }).label.trim().length > 0 &&
        typeof (item as { href?: unknown }).href === "string" &&
        (item as { href: string }).href.trim().length > 0,
    )
  );
}

export function SiteSettingsForm({ actorId, initialValues }: { actorId: string; initialValues: SettingsValues }) {
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="max-w-2xl space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          let navMenu: unknown = [];
          try {
            navMenu = JSON.parse(values.nav_menu);
          } catch {
            setMessage("Nav menu must be valid JSON");
            return;
          }
          if (!isValidNavMenu(navMenu)) {
            setMessage("Nav menu must be an array of { label, href } items");
            return;
          }
          const response = await saveSiteSettings({ ...values, nav_menu: navMenu }, actorId);
          setMessage(response.error ?? "Saved settings");
        });
      }}
    >
      <label className="block text-sm">Site title<Input value={values.site_title} onChange={(e) => setValues((v) => ({ ...v, site_title: e.target.value }))} /></label>
      <label className="block text-sm">Logo URL<Input value={values.logo_url ?? ""} onChange={(e) => setValues((v) => ({ ...v, logo_url: e.target.value }))} /></label>
      <label className="block text-sm">Footer content<Textarea value={values.footer_content ?? ""} onChange={(e) => setValues((v) => ({ ...v, footer_content: e.target.value }))} /></label>
      <label className="block text-sm">Nav menu JSON (ordered)
        <Textarea className="min-h-28" value={values.nav_menu} onChange={(e) => setValues((v) => ({ ...v, nav_menu: e.target.value }))} />
      </label>
      <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save settings"}</Button>
      {message ? <p className="text-sm">{message}</p> : null}
    </form>
  );
}
