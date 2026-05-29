"use client";
import { useReviewPage } from "../model";
import { ReviewIntro } from "@/widgets/review-intro";
import { Sm2Session } from "@/widgets/review-session";
import { ReviewDone } from "@/widgets/review-done";
import { ReviewDeckIntro } from "@/widgets/review-deck-intro";
import { DeckSession } from "@/widgets/review-deck-session";
import { ReviewDeckDone } from "@/widgets/review-deck-done";
import { PhrasebookReviewPageInline } from "./phrasebook-review-inline";
import type { DeckDueResponse } from "@/entities/deck";
import { ReviewTopbar } from "./review-topbar";
import { ReviewSidePanel } from "./review-side-panel";
import { ReviewPageSkeleton } from "./review-page-skeleton";

export const ReviewPage = () => {
	const {
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
		deckAgainCards,
		premiumLocked,
		sm2DueBadge,
		deckTotalBadge,
		phraseDueBadge,
		sm2Counts,
		deckCounts,
		panelSm2Counts,
		panelDeckCounts,
		nextWords,
		sessionMode,
		setSessionMode,
		handleStartSm2,
		handleSm2Progress,
		handleSm2Finish,
		handleStartDeck,
		handleDeckProgress,
		handleDeckFinish,
		handleDeckRetry,
		handleRetryFinish,
		handleTryDeck,
		handleUpgrade,
		handleGoSm2,
	} = useReviewPage();

	const retryDue: DeckDueResponse = {
		new: deckAgainCards,
		old: [],
		retired: [],
		repeat: [],
		numbered: [],
		currentNumberedDeck: 1,
		maxNumberedDeck: 0,
	};

	if (statsLoading && dueLoading && screen === "intro") return <ReviewPageSkeleton />;

	return (
		<>
			<ReviewTopbar
				system={system}
				dueCount={sm2DueBadge}
				deckCount={deckTotalBadge}
				phraseCount={phraseDueBadge}
				onChange={switchSystem}
			/>

			{system === "phrases" ? (
				<PhrasebookReviewPageInline />
			) : (
				<div className="flex flex-1 overflow-hidden">
					<div className="flex flex-1 flex-col overflow-x-hidden bg-panel md:overflow-y-auto">
						{system === "sm2" && screen === "intro" ? (
							<ReviewIntro
								stats={stats}
								queue={words}
								loading={statsLoading || dueLoading}
								error={dueError}
								sessionMode={sessionMode}
								onModeChange={setSessionMode}
								onStart={handleStartSm2}
							/>
						) : null}

						{system === "sm2" && screen === "card" && words.length > 0 ? (
							<Sm2Session
								words={words}
								sessionMode={sessionMode}
								onFinish={handleSm2Finish}
								onBack={goToIntro}
								onProgress={handleSm2Progress}
							/>
						) : null}

						{system === "sm2" && screen === "done" ? (
							<ReviewDone
								easy={sm2Counts.easy}
								good={sm2Counts.good}
								hard={sm2Counts.hard}
								onBackToIntro={goToIntro}
								onTryDeck={handleTryDeck}
							/>
						) : null}

						{system === "deck" && screen === "intro" ? (
							<ReviewDeckIntro
								stats={deckStats}
								loading={deckLoading}
								error={deckDueError}
								premiumLocked={premiumLocked}
								hasDue={(deckStats?.total ?? 0) > 0}
								sessionMode={sessionMode}
								onModeChange={setSessionMode}
								onStart={handleStartDeck}
								onUpgrade={handleUpgrade}
							/>
						) : null}

						{system === "deck" && screen === "card" && deckDue ? (
							<DeckSession
								due={deckDue}
								sessionMode={sessionMode}
								onFinish={handleDeckFinish}
								onProgress={handleDeckProgress}
								onBack={goToIntro}
							/>
						) : null}

						{system === "deck" && screen === "retry" && deckAgainCards.length > 0 ? (
							<DeckSession
								due={retryDue}
								sessionMode={sessionMode}
								onFinish={handleRetryFinish}
								onBack={goToIntro}
							/>
						) : null}

						{system === "deck" && screen === "done" ? (
							<ReviewDeckDone
								know={deckCounts.know}
								again={deckCounts.again}
								onBack={goToIntro}
								onGoSm2={handleGoSm2}
								onRetry={deckAgainCards.length > 0 ? handleDeckRetry : undefined}
							/>
						) : null}
					</div>

					{system === "sm2" ? (
						<ReviewSidePanel
							system={system}
							screen={screen}
							streak={stats?.streak ?? 0}
							sm2Counts={panelSm2Counts}
							deckCounts={panelDeckCounts}
							nextWords={nextWords}
						/>
					) : null}
				</div>
			)}
		</>
	);
};
