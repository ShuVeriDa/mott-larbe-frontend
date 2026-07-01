import type { SpellingMatchType } from "@/entities/spelling-dictionary";

export interface SpellingPopupState {
	isOpen: boolean;
	anchorRect: DOMRect | null;
	wrongForm: string;
	correctForm: string;
	correctForms: string[];
	matchType: SpellingMatchType;
	originalText: string;
	from: number;
	to: number;
}

export interface SpellingOccurrence {
	/** index in the occurrences array — used as stable key */
	index: number;
	/** original text in the document (may differ in case from wrongForm) */
	originalText: string;
	correctForm: string;
	/** context words before the match */
	before: string;
	/** context words after the match */
	after: string;
	from: number;
	to: number;
	/** which correctForm was chosen for this occurrence — defaults to the primary */
	selectedCorrectForm: string;
	/**
	 * Where wrongForm starts inside originalText.
	 * 0 for substring/whole_word/prefix; (matchLen - wrongLen) for suffix.
	 * Used to preserve the rest of the word when applying fix.
	 */
	matchOffset: number;
}

export interface SpellingOccurrencesDialogState {
	isOpen: boolean;
	wrongForm: string;
	matchType: SpellingMatchType;
	correctForm: string;
	correctForms: string[];
	occurrences: SpellingOccurrence[];
}
