export interface SpellingPopupState {
	isOpen: boolean;
	anchorRect: DOMRect | null;
	wrongForm: string;
	correctForm: string;
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
}

export interface SpellingOccurrencesDialogState {
	isOpen: boolean;
	wrongForm: string;
	correctForm: string;
	occurrences: SpellingOccurrence[];
}
