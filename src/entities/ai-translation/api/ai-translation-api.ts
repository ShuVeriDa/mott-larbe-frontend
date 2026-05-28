import { http } from "@/shared/api";
import type {
  AiCacheListResponse,
  AiCacheStats,
  AiPhraseTranslation,
  AiWordTranslation,
  DictionaryExportRun,
  GeminiKeyStatus,
  GeminiKeyVerifyResult,
  RefinePhraseDto,
  SaveRefinementDto,
  TranslatePhraseDto,
  TranslateWordDto,
} from "./types";

export const aiTranslationApi = {
  getKeyStatus: async (): Promise<GeminiKeyStatus> => {
    const { data } = await http.get<GeminiKeyStatus>("/ai-translation/key/status");
    return data;
  },

  saveKey: async (apiKey: string | null): Promise<GeminiKeyStatus> => {
    const { data } = await http.patch<GeminiKeyStatus>("/ai-translation/key", { apiKey });
    return data;
  },

  deleteKey: async (): Promise<GeminiKeyStatus> => {
    const { data } = await http.delete<GeminiKeyStatus>("/ai-translation/key");
    return data;
  },

  verifyKey: async (): Promise<GeminiKeyVerifyResult> => {
    const { data } = await http.post<GeminiKeyVerifyResult>("/ai-translation/key/verify");
    return data;
  },

  translateWord: async (dto: TranslateWordDto): Promise<AiWordTranslation> => {
    const { data } = await http.post<AiWordTranslation>("/ai-translation/translate/word", dto);
    return data;
  },

  translatePhrase: async (dto: TranslatePhraseDto): Promise<AiPhraseTranslation> => {
    const { data } = await http.post<AiPhraseTranslation>("/ai-translation/translate/phrase", dto);
    return data;
  },

  refinePhrase: async (dto: RefinePhraseDto): Promise<AiPhraseTranslation> => {
    const { data } = await http.post<AiPhraseTranslation>("/ai-translation/translate/phrase/refine", dto);
    return data;
  },

  saveRefinement: async (dto: SaveRefinementDto): Promise<void> => {
    await http.post("/ai-translation/cache/save-refinement", dto);
  },

  batchTranslate: async (words: string[]): Promise<Record<string, string>> => {
    const { data } = await http.post<Record<string, string>>("/ai-translation/translate/batch", { words });
    return data;
  },

  vote: async (cacheId: string, vote: "up" | "down"): Promise<AiWordTranslation> => {
    const { data } = await http.post<AiWordTranslation>(`/ai-translation/cache/${cacheId}/vote`, { vote });
    return data;
  },

  // Admin endpoints
  adminGetStats: async (): Promise<AiCacheStats> => {
    const { data } = await http.get<AiCacheStats>("/admin/ai-cache/stats");
    return data;
  },

  adminList: async (params: { status?: string; q?: string; targetLanguage?: string; page?: number; limit?: number }): Promise<AiCacheListResponse> => {
    const { data } = await http.get<AiCacheListResponse>("/admin/ai-cache", { params });
    return data;
  },

  adminApprove: async (id: string): Promise<unknown> => {
    const { data } = await http.post(`/admin/ai-cache/${id}/approve`);
    return data;
  },

  adminReject: async (id: string): Promise<unknown> => {
    const { data } = await http.post(`/admin/ai-cache/${id}/reject`);
    return data;
  },

  adminDelete: async (id: string): Promise<void> => {
    await http.delete(`/admin/ai-cache/${id}`);
  },

  adminExportToDictionary: async (): Promise<{ created: number; skipped: number; total: number; errors: number }> => {
    const { data } = await http.post<{ created: number; skipped: number; total: number; errors: number }>(
      "/admin/ai-cache/export-to-dictionary",
    );
    return data;
  },

  adminGetExportRuns: async (limit?: number): Promise<DictionaryExportRun[]> => {
    const { data } = await http.get<DictionaryExportRun[]>("/admin/ai-cache/export-runs", {
      params: limit ? { limit } : undefined,
    });
    return data;
  },
};
