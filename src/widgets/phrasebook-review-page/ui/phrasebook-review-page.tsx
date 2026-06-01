"use client";

import dynamic from "next/dynamic";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { usePhrasebookReviewPage } from "../model";
import { PhraseReviewDone } from "./phrase-review-done";
import { PhraseReviewIntro } from "./phrase-review-intro";
import { PhraseReviewSidePanel } from "./phrase-review-side-panel";

const PhraseSession = dynamic(
	() => import("./phrase-session").then((m) => ({ default: m.PhraseSession })),
	{ ssr: false },
);

interface PhrasebookReviewPageProps {
	lang: string;
	categoryId?: string;
	savedOnly?: boolean;
}

export const PhrasebookReviewPage = ({
	lang,
	categoryId,
	savedOnly,
}: PhrasebookReviewPageProps) => {
	const { t } = useI18n();
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
	} = usePhrasebookReviewPage({ categoryId, savedOnly });

	return (
		<>
			<header className="flex shrink-0 items-center gap-2.5 border-b-[0.5px] border-bd-1 bg-surf px-[22px] py-3 transition-colors duration-200 max-md:gap-2 max-md:px-3.5 max-md:py-2.5">
				<svg
					viewBox="0 0 15 15"
					fill="none"
					className="size-3.5 shrink-0 text-t-3 max-md:hidden"
					aria-hidden="true"
				>
					<path
						d="M7.5 2L2 5.5v7h4v-4h3v4h4v-7L7.5 2z"
						stroke="currentColor"
						strokeWidth="1.2"
						strokeLinejoin="round"
					/>
				</svg>
				<Typography
					tag="span"
					className="whitespace-nowrap text-[13.5px] font-semibold text-t-1 max-md:hidden"
				>
					{t("phrasebook.review.pageTitle")}
				</Typography>
			</header>

			<main className="flex flex-1 overflow-hidden">
				<div className="flex flex-1 flex-col overflow-y-auto bg-panel max-md:overflow-visible">
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
			</main>
		</>
	);
};
