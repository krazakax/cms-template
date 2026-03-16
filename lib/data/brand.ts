import { createClient } from "@/lib/supabase/server";

export type BrandTokens = {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  font_family: string;
};

function defaults(): BrandTokens {
  return {
    primary_color: "#3B82F6",
    secondary_color: "#1E40AF",
    accent_color: "#F59E0B",
    background_color: "#FFFFFF",
    text_color: "#111827",
    font_family: "Inter, sans-serif",
  };
}

export async function getBrandTokens(projectId: string | null | undefined): Promise<BrandTokens> {
  if (!projectId) return defaults();

  const supabase = await createClient();
  const { data } = await supabase
    .from("brand_tokens")
    .select("primary_color, secondary_color, accent_color, background_color, text_color, font_family")
    .eq("project_id", projectId)
    .maybeSingle();

  return {
    primary_color: data?.primary_color ?? defaults().primary_color,
    secondary_color: data?.secondary_color ?? defaults().secondary_color,
    accent_color: data?.accent_color ?? defaults().accent_color,
    background_color: data?.background_color ?? defaults().background_color,
    text_color: data?.text_color ?? defaults().text_color,
    font_family: data?.font_family ?? defaults().font_family,
  };
}
