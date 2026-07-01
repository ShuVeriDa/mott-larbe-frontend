import type { SpellingMatchType } from "../api/types";

const WORD_CHAR = "[а-яёА-ЯЁa-zA-Z0-9_]";
const WORD_BEFORE = "(?<![а-яёА-ЯЁa-zA-Z0-9_])";
const WORD_AFTER = "(?![а-яёА-ЯЁa-zA-Z0-9_])";

export const buildMatchRegex = (wrongForm: string, matchType: SpellingMatchType): RegExp => {
	const escaped = wrongForm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	let pattern: string;

	switch (matchType) {
		case "whole_word":
			pattern = `${WORD_BEFORE}${escaped}${WORD_AFTER}`;
			break;
		case "prefix":
			pattern = `${WORD_BEFORE}${escaped}${WORD_CHAR}*`;
			break;
		case "suffix":
			pattern = `${WORD_CHAR}*${escaped}${WORD_AFTER}`;
			break;
		case "substring":
		default:
			pattern = escaped;
			break;
	}

	return new RegExp(pattern, "gi");
};
