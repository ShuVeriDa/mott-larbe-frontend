import type {
	ReviewLatestContext,
	ReviewLemma,
} from "@/entities/review";

export type DeckType = "NEW" | "OLD" | "RETIRED" | "NUMBERED";

export interface NumberedDeckCount {
	deckNumber: number;
	count: number;
}

export interface DeckStats {
	new: number;
	old: number;
	retired: number;
	numbered: NumberedDeckCount[];
	total: number;
	currentNumberedDeck: number;
	maxNumberedDeck: number;
	deckMaxSize: number;
	dailyWordCount: number;
}

export interface DeckCard {
	lemmaId: string;
	deckType: DeckType;
	deckNumber?: number | null;
	movedAt: string;
	lemma: ReviewLemma;
	latestContext: ReviewLatestContext | null;
}

export interface DeckDueResponse {
	new: DeckCard[];
	old: DeckCard[];
	retired: DeckCard[];
	numbered: DeckCard[];
	currentNumberedDeck: number;
	maxNumberedDeck: number;
}

export type DeckRateResult = "know" | "again";

export interface RateDeckBody {
	result: DeckRateResult;
}

export interface RateDeckResponse {
	lemmaId: string;
	deckType: DeckType;
	movedAt: string;
	shouldRefreshDeck: boolean;
}
