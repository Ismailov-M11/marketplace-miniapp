import { tg } from "./webapp";

export function initTelegramApp(brandColor?: string) {
  if (!tg) return;

  tg.ready();
  tg.expand();

  applyTheme(brandColor);
}

export function applyTheme(brandColor?: string) {
  if (!tg) return;

  const p = tg.themeParams;

  const cssVars: Record<string, string> = {
    "--tg-bg": p.bg_color ?? "#ffffff",
    "--tg-text": p.text_color ?? "#000000",
    "--tg-hint": p.hint_color ?? "#999999",
    "--tg-link": p.link_color ?? brandColor ?? "#2563eb",
    "--tg-button": p.button_color ?? brandColor ?? "#2563eb",
    "--tg-button-text": p.button_text_color ?? "#ffffff",
    "--tg-secondary-bg": p.secondary_bg_color ?? "#f3f4f6",
    "--tg-header-bg": p.header_bg_color ?? brandColor ?? "#2563eb",
    "--tg-accent-text": p.accent_text_color ?? brandColor ?? "#2563eb",
    "--tg-section-bg": p.section_bg_color ?? "#ffffff",
    "--tg-section-header-text": p.section_header_text_color ?? "#6b7280",
    "--tg-subtitle-text": p.subtitle_text_color ?? "#6b7280",
    "--tg-destructive-text": p.destructive_text_color ?? "#ef4444",
  };

  const root = document.documentElement;
  for (const [key, val] of Object.entries(cssVars)) {
    root.style.setProperty(key, val);
  }

  if (brandColor) {
    root.style.setProperty("--brand-color", brandColor);
    tg.setHeaderColor(brandColor);
    tg.setBackgroundColor(p.bg_color ?? "#ffffff");
  }
}
