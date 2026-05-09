"use client";
import { useReviewPage } from "../model";
import { ReviewIntro } from "@/widgets/review-intro";
import { Sm2Session } from "@/widgets/review-session";
import { ReviewDone } from "@/widgets/review-done";
import { ReviewDeckIntro } from "@/widgets/review-deck-intro";
import { DeckSession } from "@/widgets/review-deck-session";
import { ReviewDeckDone } from "@/widgets/review-deck-done";
import { ReviewTopbar } from "./review-topbar";
import { ReviewSidePanel } from "./review-side-panel";

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
	} = useReviewPage();

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
							onStart={handleStartDeck}
							onUpgrade={handleUpgrade}
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
							onGoSm2={handleGoSm2}
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
