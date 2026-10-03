export const locales = ["en", "pt-BR"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "locale";

export const localeLabels: Record<Locale, string> = { en: "EN", "pt-BR": "PT" };

export function isLocale(value: unknown): value is Locale {
  return locales.includes(value as Locale);
}

// Picks the best supported locale from an Accept-Language header (e.g. "pt-BR,pt;q=0.9,en;q=0.8")
export function matchLocale(acceptLanguage: string | null | undefined): Locale {
  const ranges = (acceptLanguage || "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.find((param) => param.trim().startsWith("q="));
      return { tag, q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter(({ tag, q }) => tag && q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranges) {
    if (tag.startsWith("pt")) return "pt-BR";
    if (tag.startsWith("en")) return "en";
  }
  return defaultLocale;
}
