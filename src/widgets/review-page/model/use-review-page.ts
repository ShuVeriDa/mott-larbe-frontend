"use client";

import { useState } from "react";
import { useDeckDue, useDeckStats } from "@/entities/deck";
import { useReviewDue, useReviewStats } from "@/entities/review";
import { useReviewFlow } from "./use-review-flow";

interface Sm2Counts {
	easy: number;
	good: number;
	hard: number;
}

interface DeckCounts {
	know: number;
	again: number;
}

const ZERO_SM2: Sm2Counts = { easy: 0, good: 0, hard: 0 };
const ZERO_DECK: DeckCounts = { know: 0, again: 0 };

export const useReviewPage = () => {
	const { system, screen, switchSystem, goToCard, goToDone, goToIntro } =
		useReviewFlow();
	const { data: stats, isLoading: statsLoading } = useReviewStats();

	const dueLimit = stats?.dueCount && stats.dueCount > 0 ? stats.dueCount : 20;
	const {
		data: dueWords,
		isLoading: dueLoading,
		isError: dueError,
	} = useReviewDue(dueLimit);

	const isDeckEnabled = system === "deck" && screen !== "intro";
	const { data: deckStats, isError: deckStatsError } = useDeckStats({
		enabled: system === "deck",
	});
	const {
		data: deckDue,
		isLoading: deckLoading,
		isError: deckDueError,
	} = useDeckDue({ enabled: isDeckEnabled });

	const [sm2Counts, setSm2Counts] = useState<Sm2Counts>(ZERO_SM2);
	const [deckCounts, setDeckCounts] = useState<DeckCounts>(ZERO_DECK);
	const [liveSm2Counts, setLiveSm2Counts] = useState<Sm2Counts>(ZERO_SM2);
	const [liveSm2Index, setLiveSm2Index] = useState(0);
	const [liveDeckCounts, setLiveDeckCounts] = useState<DeckCounts>(ZERO_DECK);

	const sm2DueBadge = stats?.dueCount ?? null;
	const deckTotalBadge = deckStats?.total ?? null;
	const premiumLocked = deckStatsError === true;
	const words = dueWords ?? [];

	const nextWords =
		system === "sm2"
			? screen === "card"
				? words.slice(liveSm2Index + 1, liveSm2Index + 4)
				: words.slice(0, 4)
			: [];

	const panelSm2Counts = screen === "done" ? sm2Counts : liveSm2Counts;
	const panelDeckCounts = screen === "done" ? deckCounts : liveDeckCounts;

	const handleStartSm2 = () => {
		setSm2Counts(ZERO_SM2);
		setLiveSm2Counts(ZERO_SM2);
		setLiveSm2Index(0);
		goToCard();
	};

	const handleSm2Progress = (idx: number, _total: number, counts: Sm2Counts) => {
		setLiveSm2Index(idx);
		setLiveSm2Counts(counts);
	};

	const handleSm2Finish = (counts: Sm2Counts) => {
		setSm2Counts(counts);
		goToDone();
	};

	const handleStartDeck = () => {
		setDeckCounts(ZERO_DECK);
		setLiveDeckCounts(ZERO_DECK);
		goToCard();
	};

	const handleDeckProgress = (_idx: number, _total: number, counts: DeckCounts) => {
		setLiveDeckCounts(counts);
	};

	const handleDeckFinish = (counts: DeckCounts) => {
		setDeckCounts(counts);
		goToDone();
	};

	const handleTryDeck = () => switchSystem("deck");
	const handleUpgrade = () => {
		window.location.assign("/subscription");
	};
	const handleGoSm2 = () => switchSystem("sm2");

	return {
		system,
		screen,
		switchSystem,
		goToIntro,
		stats,
		statsLoading,
		words,
		dueLoading,
		dueError,
		deckStats,
		deckLoading,
		deckDueError,
		deckDue,
		premiumLocked,
		sm2DueBadge,
		deckTotalBadge,
		sm2Counts,
		deckCounts,
		panelSm2Counts,
		panelDeckCounts,
		nextWords,
		handleStartSm2,
		handleSm2Progress,
		handleSm2Finish,
		handleStartDeck,
		handleDeckProgress,
		handleDeckFinish,
		handleTryDeck,
		handleUpgrade,
		handleGoSm2,
	};
};

export type { DeckCounts, Sm2Counts };
