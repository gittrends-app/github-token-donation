import type { Locale } from "./config";
import { type Dictionary, en } from "./dictionaries/en";
import { ptBR } from "./dictionaries/pt-BR";

export * from "./config";
export type { Dictionary };

// Both dictionaries are tiny, so they are bundled together (also on the client)
const dictionaries: Record<Locale, Dictionary> = { en, "pt-BR": ptBR };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
