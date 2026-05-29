export type FallbackReason = "rate_limit" | "billing" | "unavailable";

export type AiCacheStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AiCacheType = "WORD_ONLY" | "WORD_IN_CONTEXT";
export type TranslationLanguage = "ru" | "en" | "ar" | "de" | "fr" | "tr";

export const SUPPORTED_TRANSLATION_LANGUAGES: TranslationLanguage[] = [
  "ru",
  "en",
  "ar",
  "de",
  "fr",
  "tr",
];

export type GeminiModel =
  | "gemini-3.1-flash-lite"
  | "gemini-3.5-flash"
  | "gemini-3.1-pro";

export const SUPPORTED_GEMINI_MODELS: GeminiModel[] = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.1-pro",
];

export const DEFAULT_GEMINI_MODEL: GeminiModel = "gemini-3.1-flash-lite";

export interface AiWordTranslation {
  id: string;
  lemma: string;
  contextSentence: string | null;
  cacheType: AiCacheType;
  targetLanguage: TranslationLanguage;
  translation: string;
  russianGloss: string | null;
  transliteration: string | null;
  partOfSpeech: string | null;
  baseForm: string | null;
  nounClass: string | null;
  example: string | null;
  source: string;
  status: AiCacheStatus;
  requestCount: number;
  thumbsUp: number;
  thumbsDown: number;
  fromCache: boolean;
  fallbackUsed?: boolean;
  fallbackReason?: FallbackReason;
  retryAfterSeconds?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AiPhraseTranslation {
  translation: string;
  russianGloss?: string;
  notes?: string;
  fallbackUsed?: boolean;
  fallbackReason?: FallbackReason;
  retryAfterSeconds?: number;
}

export interface GeminiKeyStatus {
  hasKey: boolean;
  model: GeminiModel;
}

export interface GeminiKeyVerifyResult {
  valid: boolean;
  error?: string;
}

export interface TranslateWordDto {
  word: string;
  contextSentence?: string;
  targetLanguage?: TranslationLanguage;
}

export interface TranslatePhraseDto {
  phrase: string;
  contextSentence?: string;
  targetLanguage?: TranslationLanguage;
}

export interface RefinePhraseDto {
  phrase: string;
  previousTranslation: string;
  hint: string;
  targetLanguage?: TranslationLanguage;
}

export interface SaveRefinementDto {
  word: string;
  translation: string;
  contextSentence?: string;
  targetLanguage?: TranslationLanguage;
}

export interface AiCacheEntry {
  id: string;
  lemma: string;
  cacheType: AiCacheType;
  targetLanguage: TranslationLanguage;
  translation: string;
  russianGloss: string | null;
  transliteration: string | null;
  partOfSpeech: string | null;
  baseForm: string | null;
  nounClass: string | null;
  example: string | null;
  status: AiCacheStatus;
  requestCount: number;
  thumbsUp: number;
  thumbsDown: number;
  exportedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AiCacheStats {
  pending: number;
  approvedThisWeek: number;
  rejected: number;
  approvedNotExported: number;
  topWords: Array<{ lemma: string; requestCount: number; translation: string; status: AiCacheStatus }>;
}

export interface AiCacheListResponse {
  items: AiCacheEntry[];
  total: number;
  page: number;
  limit: number;
}

export type ExportRunStatus = "running" | "ok" | "error";

export interface DictionaryExportRun {
  id: string;
  triggeredBy: string;
  startedAt: string;
  finishedAt: string | null;
  created: number;
  skipped: number;
  errors: number;
  total: number;
  status: ExportRunStatus;
  errorMessage: string | null;
}
