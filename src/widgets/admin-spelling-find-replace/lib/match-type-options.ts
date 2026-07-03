import type { SpellingMatchType } from "@/entities/spelling-dictionary";

export const getMatchTypeOptions = (
	t: (key: string) => string,
): { value: SpellingMatchType; label: string }[] => [
	{ value: "substring", label: t("admin.spellingDictionaryFindReplace.matchType.substring") },
	{ value: "whole_word", label: t("admin.spellingDictionaryFindReplace.matchType.wholeWord") },
	{ value: "prefix", label: t("admin.spellingDictionaryFindReplace.matchType.prefix") },
	{ value: "suffix", label: t("admin.spellingDictionaryFindReplace.matchType.suffix") },
];
