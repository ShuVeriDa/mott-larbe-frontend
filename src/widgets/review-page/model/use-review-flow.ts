"use client";
import { useState } from 'react';
import { useSearchParams } from "next/navigation";
import type { ReviewSystem } from "../ui/review-topbar";

export type ReviewScreen = "intro" | "card" | "done" | "retry";

export interface ReviewFlowState {
	system: ReviewSystem;
	screen: ReviewScreen;
}

export interface UseReviewFlowResult extends ReviewFlowState {
	switchSystem: (system: ReviewSystem) => void;
	goToCard: () => void;
	goToDone: () => void;
	goToIntro: () => void;
	goToRetry: () => void;
}

const VALID_SYSTEMS: ReviewSystem[] = ["sm2", "deck", "phrases"];

const parseSystem = (value: string | null): ReviewSystem => {
	if (value && (VALID_SYSTEMS as string[]).includes(value)) {
		return value as ReviewSystem;
	}
	return "sm2";
};

export const useReviewFlow = (): UseReviewFlowResult => {
	const searchParams = useSearchParams();
	const [system, setSystem] = useState<ReviewSystem>(() =>
		parseSystem(searchParams.get("system")),
	);
	const [screen, setScreen] = useState<ReviewScreen>("intro");

	const switchSystem = (next: ReviewSystem) => {
		setSystem(next);
		setScreen("intro");
	};

	const goToCard = () => setScreen("card");
	const goToDone = () => setScreen("done");
	const goToIntro = () => setScreen("intro");
	const goToRetry = () => setScreen("retry");

	return { system, screen, switchSystem, goToCard, goToDone, goToIntro, goToRetry };
};
