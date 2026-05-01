export type ReviewWordStatus = "NEW" | "LEARNING" | "REVIEW" | "RELEARNING";

export interface ReviewStats {
	dueCount: number;
	learningCount: number;
	streak: number;
}

export interface ReviewMorphForm {
	form: string;
	grammarTag: string | null;
	gramCase: string | null;
	gramNumber: string | null;
}

export interface ReviewHeadwordEntry {
	rawTranslate: string;
}

export interface ReviewHeadword {
	entry: ReviewHeadwordEntry;
}

export interface ReviewLemma {
	id: string;
	baseForm: string;
	partOfSpeech: string | null;
	headwords: ReviewHeadword[];
	morphForms: ReviewMorphForm[];
}

export interface ReviewLatestContext {
	snippet: string;
	sourceTitle: string;
	sourceTextId: string;
	seenAt: string;
}

export interface ReviewDueWord {
	userId: string;
	lemmaId: string;
	status: ReviewWordStatus;
	interval: number;
	easeFactor: number;
	repetitions: number;
	nextReview: string;
	lemma: ReviewLemma;
	latestContext: ReviewLatestContext | null;
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export interface RateReviewBody {
	quality: ReviewQuality;
}

export interface RateReviewResponse {
	userId: string;
	lemmaId: string;
	status: ReviewWordStatus;
	interval: number;
	easeFactor: number;
	repetitions: number;
	nextReview: string;
}
