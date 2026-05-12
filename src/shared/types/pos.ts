export type PartOfSpeech = "noun" | "verb" | "adjective" | "adverb" | "pronoun" | "numeral" | "particle" | "conjunction" | "preposition" | "interjection";

export const POS_OPTIONS: readonly PartOfSpeech[] = [
	"noun",
	"verb",
	"adjective",
	"adverb",
	"pronoun",
	"numeral",
	"particle",
	"conjunction",
	"preposition",
	"interjection",
] as const;
