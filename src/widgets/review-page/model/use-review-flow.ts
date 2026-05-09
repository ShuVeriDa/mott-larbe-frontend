"use client";
import { useState } from 'react';
import type { ReviewSystem } from "../ui/review-topbar";

export type ReviewScreen = "intro" | "card" | "done";

export interface ReviewFlowState {
	system: ReviewSystem;
	screen: ReviewScreen;
}

export interface UseReviewFlowResult extends ReviewFlowState {
	switchSystem: (system: ReviewSystem) => void;
	goToCard: () => void;
	goToDone: () => void;
	goToIntro: () => void;
}

export const useReviewFlow = (
	initial: ReviewSystem = "sm2",
): UseReviewFlowResult => {
	const [system, setSystem] = useState<ReviewSystem>(initial);
	const [screen, setScreen] = useState<ReviewScreen>("intro");

	const switchSystem = (next: ReviewSystem) => {
		setSystem(next);
		setScreen("intro");
	};

	const goToCard = () => setScreen("card");
	const goToDone = () => setScreen("done");
	const goToIntro = () => setScreen("intro");

	return { system, screen, switchSystem, goToCard, goToDone, goToIntro };
};
