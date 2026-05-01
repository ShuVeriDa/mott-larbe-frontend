import type { CefrLevel, LearningLevel } from "@/shared/types";

export interface WordLookupExample {
	text: string;
	translation: string;
}

export interface WordLookupResponse {
	lemmaId: string;
	translation: string;
	tranAlt: string | null;
	grammar: string | null;
	baseForm: string;
	forms: string[];
	tags: string[];
	examples: WordLookupExample[];
	userStatus: LearningLevel | null;
	inDictionary: boolean;
	dictionaryEntryId: string | null;
}

export interface WordCorpusExample {
	snippet: string;
	textId: string;
	textTitle: string;
	level: CefrLevel | null;
	position: number;
}
