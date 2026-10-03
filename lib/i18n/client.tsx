"use client";

import * as React from "react";
import { type Dictionary, getDictionary, type Locale } from "@/lib/i18n";

const I18nContext = React.createContext<{ locale: Locale; t: Dictionary } | null>(null);

// Receives only the locale from the server: dictionaries contain functions, which can't be serialized
export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const value = React.useMemo(() => ({ locale, t: getDictionary(locale) }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = React.useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside <I18nProvider>");
  return context;
}
