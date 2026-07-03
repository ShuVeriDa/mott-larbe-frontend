import type { SpellingMatchType } from "@/entities/spelling-dictionary";

const DEFAULT_VALUE = "__default__";

export const getMatchTypeFilterOptions = (
	t: (key: string) => string,
): { value: string; label: string }[] => [
	{ value: DEFAULT_VALUE, label: t("admin.spellingDictionaryDetail.matchTypeFilter.default") },
	{ value: "substring", label: t("admin.spellingDictionaryDetail.matchType.substring") },
	{ value: "whole_word", label: t("admin.spellingDictionaryDetail.matchType.wholeWord") },
	{ value: "prefix", label: t("admin.spellingDictionaryDetail.matchType.prefix") },
	{ value: "suffix", label: t("admin.spellingDictionaryDetail.matchType.suffix") },
];

export const toMatchTypeFilterValue = (matchType: SpellingMatchType | null): string =>
	matchType ?? DEFAULT_VALUE;

export const fromMatchTypeFilterValue = (value: string): SpellingMatchType | null =>
	value === DEFAULT_VALUE ? null : (value as SpellingMatchType);
