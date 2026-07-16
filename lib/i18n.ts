/**
 * i18n helper — XingAI global standard.
 *
 * All UI strings go through tr(lang, en, zh) with a typed Lang, instead of
 * hardcoding English in JSX and only translating "explanations". This keeps
 * the whole UI (not just AI-generated feedback text) bilingual.
 */

export type Lang = "en" | "zh";

export function tr(lang: Lang, en: string, zh?: string): string {
  if (lang === "zh" && zh) {
    return zh;
  }
  return en;
}
