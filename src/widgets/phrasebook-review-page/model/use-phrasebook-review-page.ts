"use client";

import { useState } from "react";
import { usePhraseReviewDue, usePhraseReviewStats } from "@/entities/phrasebook";

export type PhraseReviewScreen = "intro" | "card" | "done";
export type PhraseReviewMode = "all" | "category" | "saved";

export interface PhraseCounts {
	easy: number;
	good: number;
	hard: number;
}

const ZERO_COUNTS: PhraseCounts = { easy: 0, good: 0, hard: 0 };

export const usePhrasebookReviewPage = (initialParams?: {
	categoryId?: string;
	savedOnly?: boolean;
}) => {
	const [screen, setScreen] = useState<PhraseReviewScreen>("intro");
	const [counts, setCounts] = useState<PhraseCounts>(ZERO_COUNTS);
	const [liveIndex, setLiveIndex] = useState(0);
	const [liveCounts, setLiveCounts] = useState<PhraseCounts>(ZERO_COUNTS);

	const [mode, setMode] = useState<PhraseReviewMode>(() => {
		if (initialParams?.savedOnly) return "saved";
		if (initialParams?.categoryId) return "category";
		return "all";
	});
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(
		initialParams?.categoryId,
	);

	const dueParams = {
		categoryId: mode === "category" ? selectedCategoryId : undefined,
		savedOnly: mode === "saved" ? true : undefined,
	};

	const { data: stats, isLoading: statsLoading } = usePhraseReviewStats();
	const {
		data: duePhrases,
		isLoading: dueLoading,
		isError: dueError,
	} = usePhraseReviewDue(dueParams);

	const phrases = duePhrases ?? [];

	const handleStart = () => {
		setCounts(ZERO_COUNTS);
		setLiveCounts(ZERO_COUNTS);
		setLiveIndex(0);
		setScreen("card");
	};

	const handleProgress = (idx: number, _total: number, c: PhraseCounts) => {
		setLiveIndex(idx);
		setLiveCounts(c);
	};

	const handleFinish = (finalCounts: PhraseCounts) => {
		setCounts(finalCounts);
		setScreen("done");
	};

	const handleRestart = () => {
		setCounts(ZERO_COUNTS);
		setLiveCounts(ZERO_COUNTS);
		setLiveIndex(0);
		setScreen("intro");
	};

	const nextPhrases =
		screen === "card"
			? phrases.slice(liveIndex + 1, liveIndex + 4)
			: phrases.slice(0, 4);

	const panelCounts = screen === "done" ? counts : liveCounts;

	return {
		screen,
		stats,
		statsLoading,
		phrases,
		dueLoading,
		dueError,
		counts,
		liveCounts,
		panelCounts,
		nextPhrases,
		mode,
		setMode,
		selectedCategoryId,
		setSelectedCategoryId,
		handleStart,
		handleProgress,
		handleFinish,
		handleRestart,
	};
};
