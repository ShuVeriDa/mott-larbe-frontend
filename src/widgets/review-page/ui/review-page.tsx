"use client";

import { useCallback, useState } from "react";
import { useReviewDue, useReviewStats } from "@/entities/review";
import { useDeckDue, useDeckStats } from "@/entities/deck";
import { ReviewIntro } from "@/widgets/review-intro";
import { Sm2Session } from "@/widgets/review-session";
import { ReviewDone } from "@/widgets/review-done";
import { ReviewDeckIntro } from "@/widgets/review-deck-intro";
import { DeckSession } from "@/widgets/review-deck-session";
import { ReviewDeckDone } from "@/widgets/review-deck-done";
import { useReviewFlow } from "../model";
import { ReviewTopbar } from "./review-topbar";
import { ReviewSidePanel } from "./review-side-panel";

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

export const ReviewPage = () => {
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

	const handleStartSm2 = useCallback(() => {
		setSm2Counts(ZERO_SM2);
		setLiveSm2Counts(ZERO_SM2);
		setLiveSm2Index(0);
		goToCard();
	}, [goToCard]);

	const handleSm2Progress = useCallback(
		(idx: number, _total: number, counts: Sm2Counts) => {
			setLiveSm2Index(idx);
			setLiveSm2Counts(counts);
		},
		[],
	);

	const handleSm2Finish = useCallback(
		(counts: Sm2Counts) => {
			setSm2Counts(counts);
			goToDone();
		},
		[goToDone],
	);

	const handleStartDeck = useCallback(() => {
		setDeckCounts(ZERO_DECK);
		setLiveDeckCounts(ZERO_DECK);
		goToCard();
	}, [goToCard]);

	const handleDeckProgress = useCallback(
		(_idx: number, _total: number, counts: DeckCounts) => {
			setLiveDeckCounts(counts);
		},
		[],
	);

	const handleDeckFinish = useCallback(
		(counts: DeckCounts) => {
			setDeckCounts(counts);
			goToDone();
		},
		[goToDone],
	);

	const words = dueWords ?? [];
	const nextWords =
		system === "sm2"
			? screen === "card"
				? words.slice(liveSm2Index + 1, liveSm2Index + 4)
				: words.slice(0, 4)
			: [];

	const panelSm2Counts = screen === "done" ? sm2Counts : liveSm2Counts;
	const panelDeckCounts = screen === "done" ? deckCounts : liveDeckCounts;

	return (
		<>
			<ReviewTopbar
				system={system}
				dueCount={sm2DueBadge}
				deckCount={deckTotalBadge}
				onChange={switchSystem}
			/>

			<div className="flex flex-1 overflow-hidden">
				<div className="flex flex-1 flex-col overflow-y-auto bg-panel max-md:overflow-visible">
					{system === "sm2" && screen === "intro" ? (
						<ReviewIntro
							stats={stats}
							queue={words}
							loading={statsLoading || dueLoading}
							error={dueError}
							onStart={handleStartSm2}
						/>
					) : null}

					{system === "sm2" && screen === "card" && words.length > 0 ? (
						<Sm2Session
							words={words}
							onFinish={handleSm2Finish}
							onProgress={handleSm2Progress}
						/>
					) : null}

					{system === "sm2" && screen === "done" ? (
						<ReviewDone
							easy={sm2Counts.easy}
							good={sm2Counts.good}
							hard={sm2Counts.hard}
							onBackToIntro={goToIntro}
							onTryDeck={() => switchSystem("deck")}
						/>
					) : null}

					{system === "deck" && screen === "intro" ? (
						<ReviewDeckIntro
							stats={deckStats}
							loading={deckLoading}
							error={deckDueError}
							premiumLocked={premiumLocked}
							hasDue={(deckStats?.total ?? 0) > 0}
							onStart={handleStartDeck}
							onUpgrade={() => {
								window.location.assign("/subscription");
							}}
						/>
					) : null}

					{system === "deck" && screen === "card" && deckDue ? (
						<DeckSession
							due={deckDue}
							onFinish={handleDeckFinish}
							onProgress={handleDeckProgress}
							onBack={goToIntro}
						/>
					) : null}

					{system === "deck" && screen === "done" ? (
						<ReviewDeckDone
							know={deckCounts.know}
							again={deckCounts.again}
							onBack={goToIntro}
							onGoSm2={() => switchSystem("sm2")}
						/>
					) : null}
				</div>

				<ReviewSidePanel
					system={system}
					screen={screen}
					streak={stats?.streak ?? 0}
					sm2Counts={panelSm2Counts}
					deckCounts={panelDeckCounts}
					nextWords={nextWords}
				/>
			</div>
		</>
	);
};
