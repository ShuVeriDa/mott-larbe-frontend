import type { AdminPhrasebookTab } from "../model/types";
import type { PhraseLang } from "@/entities/phrasebook";

export const PHRASES_LIMIT = 30;

export const VALID_TABS: AdminPhrasebookTab[] = ["categories", "phrases", "suggestions"];

export const PHRASE_LANGS: PhraseLang[] = ["che", "ru", "en", "ar"];
