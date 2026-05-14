import type { PhraseLanguage } from "./types";

export const adminTextPhraseKeys = {
  root: ["admin", "text-phrases"] as const,
  list: (language?: PhraseLanguage) =>
    ["admin", "text-phrases", "list", { language }] as const,
  detail: (id: string) => ["admin", "text-phrases", id] as const,
  byPage: (textId: string, pageNumber: number) =>
    ["admin", "text-phrases", "by-page", textId, pageNumber] as const,
};
