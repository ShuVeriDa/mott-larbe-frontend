import type { TextLanguage } from "@/entities/text";
import type { SourceLanguage } from "../api/types";

const TEXT_TO_SOURCE_LANGUAGE: Record<TextLanguage, SourceLanguage | null> = {
	CHE: "che",
	AR: "ar",
	EN: "en",
	// RU texts have no matching backend SourceLanguage — the app never treats
	// Russian as content to translate FROM, only as a translation target.
	RU: null,
};

export const toSourceLanguage = (
	language: TextLanguage | null | undefined,
): SourceLanguage | undefined =>
	language ? (TEXT_TO_SOURCE_LANGUAGE[language] ?? undefined) : undefined;
