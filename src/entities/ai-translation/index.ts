export { aiTranslationApi } from "./api/ai-translation-api";
export { aiTranslationKeys } from "./api/ai-translation-keys";
export { SUPPORTED_TRANSLATION_LANGUAGES, SUPPORTED_GEMINI_MODELS, DEFAULT_GEMINI_MODEL } from "./api/types";
export type {
  AiCacheEntry,
  AiCacheListResponse,
  AiCacheStats,
  AiCacheStatus,
  AiCacheType,
  AiPhraseTranslation,
  AiWordTranslation,
  DictionaryExportRun,
  ExportRunStatus,
  FallbackReason,
  GeminiKeyStatus,
  GeminiKeyVerifyResult,
  GeminiModel,
  RefinePhraseDto,
  SaveRefinementDto,
  TranslatePhraseDto,
  TranslateWordDto,
  TranslationLanguage,
} from "./api/types";
export { useGeminiKeyStatus } from "./model/use-gemini-key-status";
export { useAiWordTranslation } from "./model/use-ai-word-translation";
export { useAiPhraseTranslation } from "./model/use-ai-phrase-translation";
