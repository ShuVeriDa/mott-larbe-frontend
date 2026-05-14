import { http } from "@/shared/api";
import type {
  CreatePhraseAutoOccurrenceDto,
  CreatePhraseWithOccurrenceDto,
  CreatePhraseWithOccurrenceResult,
  CreateTextPhraseDto,
  CreateTextPhraseOccurrenceDto,
  PagePhraseOccurrence,
  PhraseLanguage,
  TextPhrase,
  TextPhraseOccurrence,
  TextPhraseWithOccurrences,
  UpdateTextPhraseDto,
} from "./types";

export const adminTextPhraseApi = {
  // ── Phrases ──────────────────────────────────────────────────────────────

  list: async (language?: PhraseLanguage): Promise<TextPhrase[]> => {
    const params = language ? { language } : undefined;
    const { data } = await http.get<TextPhrase[]>("/admin/text-phrases", { params });
    return data;
  },

  getById: async (id: string): Promise<TextPhraseWithOccurrences> => {
    const { data } = await http.get<TextPhraseWithOccurrences>(`/admin/text-phrases/${id}`);
    return data;
  },

  create: async (dto: CreateTextPhraseDto): Promise<TextPhrase> => {
    const { data } = await http.post<TextPhrase>("/admin/text-phrases", dto);
    return data;
  },

  update: async (id: string, dto: UpdateTextPhraseDto): Promise<TextPhrase> => {
    const { data } = await http.patch<TextPhrase>(`/admin/text-phrases/${id}`, dto);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await http.delete(`/admin/text-phrases/${id}`);
  },

  // ── Primary: auto-detect token positions from page ────────────────────────

  createAutoOccurrence: async (
    dto: CreatePhraseAutoOccurrenceDto,
  ): Promise<CreatePhraseWithOccurrenceResult> => {
    const { data } = await http.post<CreatePhraseWithOccurrenceResult>(
      "/admin/text-phrases/auto-occurrence",
      dto,
    );
    return data;
  },

  createWithOccurrence: async (
    dto: CreatePhraseWithOccurrenceDto,
  ): Promise<CreatePhraseWithOccurrenceResult> => {
    const { data } = await http.post<CreatePhraseWithOccurrenceResult>(
      "/admin/text-phrases/with-occurrence",
      dto,
    );
    return data;
  },

  // ── Occurrences ──────────────────────────────────────────────────────────

  addOccurrence: async (
    phraseId: string,
    dto: CreateTextPhraseOccurrenceDto,
  ): Promise<TextPhraseOccurrence> => {
    const { data } = await http.post<TextPhraseOccurrence>(
      `/admin/text-phrases/${phraseId}/occurrences`,
      dto,
    );
    return data;
  },

  deleteOccurrence: async (occurrenceId: string): Promise<void> => {
    await http.delete(`/admin/text-phrases/occurrences/${occurrenceId}`);
  },

  // ── By page (for admin editor) ───────────────────────────────────────────

  getByPage: async (
    textId: string,
    pageNumber: number,
  ): Promise<PagePhraseOccurrence[]> => {
    const { data } = await http.get<PagePhraseOccurrence[]>(
      `/admin/text-phrases/by-page/${textId}/${pageNumber}`,
    );
    return data;
  },
};
