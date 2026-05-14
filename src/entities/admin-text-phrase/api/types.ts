export type PhraseLanguage = "CHE" | "RU" | "AR" | "EN";

export interface TextPhrase {
  id: string;
  original: string;
  normalized: string;
  translation: string;
  language: PhraseLanguage;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { occurrences: number };
}

export interface TextPhraseOccurrence {
  id: string;
  phraseId: string;
  textId: string;
  pageNumber: number;
  startTokenPosition: number;
  endTokenPosition: number;
  createdAt: string;
  text?: { id: string; title: string };
}

export interface TextPhraseWithOccurrences extends TextPhrase {
  occurrences: TextPhraseOccurrence[];
}

export interface CreatePhraseWithOccurrenceDto {
  original: string;
  translation: string;
  language: PhraseLanguage;
  notes?: string;
  textId: string;
  pageNumber: number;
  startTokenPosition: number;
  endTokenPosition: number;
}

export interface CreateTextPhraseDto {
  original: string;
  translation: string;
  language: PhraseLanguage;
  notes?: string;
}

export interface CreatePhraseAutoOccurrenceDto {
  original: string;
  translation: string;
  language: PhraseLanguage;
  notes?: string;
  textId: string;
  pageNumber: number;
}

export interface UpdateTextPhraseDto {
  original?: string;
  translation?: string;
  language?: PhraseLanguage;
  notes?: string;
}

export interface CreateTextPhraseOccurrenceDto {
  textId: string;
  pageNumber: number;
  startTokenPosition: number;
  endTokenPosition: number;
}

export interface CreatePhraseWithOccurrenceResult {
  phrase: TextPhrase;
  occurrence: TextPhraseOccurrence;
}

// Response from GET /texts/:id/pages/:pageNumber/phrases (public)
export interface PagePhraseOccurrence {
  id: string;
  startTokenPosition: number;
  endTokenPosition: number;
  phrase: {
    id: string;
    original: string;
    translation: string;
    notes: string | null;
  };
}
