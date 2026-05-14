import type { CefrLevel, LearningLevel } from "@/shared/types";

export interface WordLookupExample {
	text: string;
	translation: string | null;
}

export interface WordLookupMeaning {
	translation: string;
	note: string | null;
	examples: WordLookupExample[];
}

export interface WordLookupGrammar {
	genitive?: string | null;
	dative?: string | null;
	ergative?: string | null;
	instrumental?: string | null;
	plural?: string | null;
	pluralClass?: string | null;
	obliqueStem?: string | null;
	verbPresent?: string | null;
	verbPast?: string | null;
	verbParticiple?: string | null;
}

export interface WordLookupResponse {
	lemmaId: string | null;
	translation: string | null;
	grammar: string | null;
	grammarForms: WordLookupGrammar | null;
	nounClass: string | null;
	nounClassPlural: string | null;
	baseForm: string | null;
	forms: string[];
	tags: string[];
	wordLevel: string | null;
	variants: string[];
	sources: string[];
	attested: boolean;
	setPhrases: { nah: string; ru: string }[] | null;
	meanings: WordLookupMeaning[];
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
