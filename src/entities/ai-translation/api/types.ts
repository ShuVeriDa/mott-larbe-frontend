export type AiCacheStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AiCacheType = "WORD_ONLY" | "WORD_IN_CONTEXT";

export interface AiWordTranslation {
  id: string;
  lemma: string;
  contextSentence: string | null;
  cacheType: AiCacheType;
  translation: string;
  transliteration: string | null;
  partOfSpeech: string | null;
  example: string | null;
  source: string;
  status: AiCacheStatus;
  requestCount: number;
  thumbsUp: number;
  thumbsDown: number;
  fromCache: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AiPhraseTranslation {
  translation: string;
  notes?: string;
}

export interface GeminiKeyStatus {
  hasKey: boolean;
}

export interface GeminiKeyVerifyResult {
  valid: boolean;
  error?: string;
}

export interface TranslateWordDto {
  word: string;
  contextSentence?: string;
}

export interface TranslatePhraseDto {
  phrase: string;
  contextSentence?: string;
}

export interface RefinePhraseDto {
  phrase: string;
  previousTranslation: string;
  hint: string;
}

export interface SaveRefinementDto {
  word: string;
  translation: string;
  contextSentence?: string;
}

export interface AiCacheEntry {
  id: string;
  lemma: string;
  translation: string;
  transliteration: string | null;
  partOfSpeech: string | null;
  example: string | null;
  status: AiCacheStatus;
  cacheType: AiCacheType;
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
