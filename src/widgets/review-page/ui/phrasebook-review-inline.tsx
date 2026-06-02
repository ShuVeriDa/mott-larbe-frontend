"use client";

import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { usePhrasebookReviewPage } from "@/widgets/phrasebook-review-page/model";
import { PhraseReviewIntro } from "@/widgets/phrasebook-review-page/ui/phrase-review-intro";
import { PhraseReviewDone } from "@/widgets/phrasebook-review-page/ui/phrase-review-done";
import { PhraseReviewSidePanel } from "@/widgets/phrasebook-review-page/ui/phrase-review-side-panel";

const PhraseSession = dynamic(
	() => import("@/widgets/phrasebook-review-page/ui/phrase-session").then((m) => ({ default: m.PhraseSession })),
	{ ssr: false },
);

export const PhrasebookReviewPageInline = () => {
	const params = useParams<{ lang: string }>();
	const lang = params.lang ?? DEFAULT_LOCALE;
	const searchParams = useSearchParams();
	const categoryId = searchParams.get("category") ?? undefined;

	const {
		screen,
		stats,
		statsLoading,
		phrases,
		dueLoading,
		dueError,
		counts,
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
	} = usePhrasebookReviewPage({ categoryId });

	return (
		<div className="flex flex-1 overflow-hidden">
			<div className="flex flex-1 flex-col overflow-x-hidden bg-panel md:overflow-y-auto">
				{screen === "intro" ? (
					<PhraseReviewIntro
						stats={stats}
						queue={phrases}
						loading={statsLoading || dueLoading}
						error={dueError}
						mode={mode}
						selectedCategoryId={selectedCategoryId}
						onModeChange={setMode}
						onCategoryChange={setSelectedCategoryId}
						onStart={handleStart}
					/>
				) : null}

				{screen === "card" && phrases.length > 0 ? (
					<PhraseSession
						phrases={phrases}
						onFinish={handleFinish}
						onBack={handleRestart}
						onProgress={handleProgress}
					/>
				) : null}

				{screen === "done" ? (
					<PhraseReviewDone
						counts={counts}
						lang={lang}
						onReviewAgain={handleRestart}
					/>
				) : null}
			</div>

			<PhraseReviewSidePanel
				screen={screen}
				streak={stats?.streak ?? 0}
				counts={panelCounts}
				nextPhrases={nextPhrases}
			/>
		</div>
	);
};
