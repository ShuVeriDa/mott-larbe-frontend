"use client";

import dynamic from "next/dynamic";
import { useReviewPage } from "../model";
import { ReviewIntro } from "@/widgets/review-intro";
import { ReviewDone } from "@/widgets/review-done";
import { ReviewDeckIntro } from "@/widgets/review-deck-intro";
import { ReviewDeckDone } from "@/widgets/review-deck-done";
import { PhrasebookReviewPageInline } from "./phrasebook-review-inline";
import type { DeckDueResponse } from "@/entities/deck";
import { ReviewTopbar } from "./review-topbar";
import { ReviewSidePanel } from "./review-side-panel";
import { ReviewDisabledScreen } from "./review-disabled-screen";
import { useI18n } from "@/shared/lib/i18n";

const Sm2Session = dynamic(
	() => import("@/widgets/review-session").then((m) => ({ default: m.Sm2Session })),
	{ ssr: false },
);

const DeckSession = dynamic(
	() => import("@/widgets/review-deck-session").then((m) => ({ default: m.DeckSession })),
	{ ssr: false },
);

export const ReviewPage = () => {
	const { t } = useI18n();
	const {
		system,
		screen,
		switchSystem,
		goToIntro,
		stats,
		words,
		deckStats,
		deckLoading,
		deckDueError,
		deckDue,
		deckAgainCards,
		premiumLocked,
		enableDecks,
		enableSm2,
		enablePhrases,
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
				enablePhrases ? (
					<PhrasebookReviewPageInline />
				) : (
					<ReviewDisabledScreen
						settingLabel={t("settings.learning.enablePhrases")}
						enableKey="enablePhrases"
					/>
				)
			) : (
				<div className="flex flex-1 overflow-hidden">
					<div className="flex flex-1 flex-col overflow-x-hidden bg-panel md:overflow-y-auto">
						{system === "sm2" && !enableSm2 ? (
							<ReviewDisabledScreen
								settingLabel={t("settings.learning.enableSm2")}
								enableKey="enableSm2"
							/>
						) : null}

						{system === "sm2" && enableSm2 && screen === "intro" ? (
							<ReviewIntro
								stats={stats}
								queue={words}
								loading={false}
								error={false}
								sessionMode={sessionMode}
								onModeChange={setSessionMode}
								onStart={handleStartSm2}
							/>
						) : null}

						{system === "sm2" && enableSm2 && screen === "card" && words.length > 0 ? (
							<Sm2Session
								words={words}
								sessionMode={sessionMode}
								onFinish={handleSm2Finish}
								onBack={goToIntro}
								onProgress={handleSm2Progress}
							/>
						) : null}

						{system === "sm2" && enableSm2 && screen === "done" ? (
							<ReviewDone
								easy={sm2Counts.easy}
								good={sm2Counts.good}
								hard={sm2Counts.hard}
								onBackToIntro={goToIntro}
								onTryDeck={handleTryDeck}
							/>
						) : null}

						{system === "deck" && !enableDecks ? (
							<ReviewDisabledScreen
								settingLabel={t("settings.learning.enableDecks")}
								enableKey="enableDecks"
							/>
						) : null}

						{system === "deck" && enableDecks && screen === "intro" ? (
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

						{system === "deck" && enableDecks && screen === "card" && deckDue ? (
							<DeckSession
								due={deckDue}
								sessionMode={sessionMode}
								onFinish={handleDeckFinish}
								onProgress={handleDeckProgress}
								onBack={goToIntro}
							/>
						) : null}

						{system === "deck" && enableDecks && screen === "retry" && deckAgainCards.length > 0 ? (
							<DeckSession
								due={retryDue}
								sessionMode={sessionMode}
								onFinish={handleRetryFinish}
								onBack={goToIntro}
							/>
						) : null}

						{system === "deck" && enableDecks && screen === "done" ? (
							<ReviewDeckDone
								know={deckCounts.know}
								again={deckCounts.again}
								onBack={goToIntro}
								onGoSm2={handleGoSm2}
								onRetry={deckAgainCards.length > 0 ? handleDeckRetry : undefined}
							/>
						) : null}
					</div>

					{system === "sm2" && enableSm2 ? (
						<ReviewSidePanel
							system={system}
							screen={screen}
							streak={stats.streak ?? 0}
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
