/**
 * i18n helper — XingAI global standard.
 *
 * Locale codes: en | zh | ko (never "cn").
 * All UI strings go through tr() so the whole surface stays localized,
 * not only AI feedback text.
 */

export type Lang = "en" | "zh" | "ko";

export const LANG_CYCLE: Lang[] = ["en", "zh", "ko"];

export function nextLang(lang: Lang): Lang {
  const i = LANG_CYCLE.indexOf(lang);
  return LANG_CYCLE[(i + 1) % LANG_CYCLE.length];
}

export function langLabel(lang: Lang): string {
  if (lang === "zh") return "中";
  if (lang === "ko") return "한";
  return "EN";
}

export function tr(lang: Lang, en: string, zh?: string, ko?: string): string {
  if (lang === "zh" && zh) return zh;
  if (lang === "ko" && ko) return ko;
  return en;
}

export const LANG_STORAGE_KEY = "xingai_eec_lang";
export const THEME_STORAGE_KEY = "xingai_eec_theme";
