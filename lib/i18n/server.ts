import { cookies, headers } from "next/headers";
import { getDictionary, isLocale, LOCALE_COOKIE, type Locale, matchLocale } from "@/lib/i18n";

// Locale precedence: explicit choice (cookie) > browser preference (Accept-Language) > default
export async function getLocale(): Promise<Locale> {
  const chosen = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;
  return matchLocale((await headers()).get("accept-language"));
}

export async function getI18n() {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}
