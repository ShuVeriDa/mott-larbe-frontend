"use client";
import type { AccuracyStats, PhraseAccuracyStats } from "@/entities/statistics";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { useState } from "react";
import { AccuracyRow } from "./accuracy-row";

interface AccuracyCardProps {
	accuracy: AccuracyStats;
	phraseAccuracy: PhraseAccuracyStats;
}

type Tab = "words" | "phrases";

export const AccuracyCard = ({ accuracy, phraseAccuracy }: AccuracyCardProps) => {
	const { t } = useI18n();
	const [tab, setTab] = useState<Tab>("words");

	const handleTabWords = () => setTab("words");
	const handleTabPhrases = () => setTab("phrases");

	const isWords = tab === "words";
	const stats = isWords ? accuracy : phraseAccuracy;
	const correctPct = stats.percent;
	const wrongPct = Math.max(0, 100 - stats.percent);

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4 transition-colors">
			<header className="mb-3 flex flex-wrap items-center justify-between gap-1.5">
				<div role="tablist" className="flex items-center gap-0.5 rounded-base bg-surf-2 p-0.5">
					<button
						role="tab"
						aria-selected={isWords}
						onClick={handleTabWords}
						className={cn(
							"rounded-[5px] px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1",
							isWords ? "bg-surf text-t-1 shadow-sm" : "text-t-3 hover:text-t-2",
						)}
					>
						{t("statistics.words.title")}
					</button>
					<button
						role="tab"
						aria-selected={!isWords}
						onClick={handleTabPhrases}
						className={cn(
							"rounded-[5px] px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1",
							!isWords ? "bg-surf text-t-1 shadow-sm" : "text-t-3 hover:text-t-2",
						)}
					>
						{t("statistics.phrases.title")}
					</button>
				</div>
				<Typography tag="span" className="text-[11px] text-t-3">
					{isWords ? t("statistics.accuracy.meta") : t("statistics.accuracyPhrases.meta")}
				</Typography>
			</header>

			{/* Big percentage */}
			<div className="mb-3 flex items-center gap-2">
				<Typography
					tag="p"
					className="font-display text-4xl font-normal leading-none tracking-[-1px] text-grn"
				>
					{Math.round(stats.percent)}%
				</Typography>
				<Typography tag="p" className="text-[11px] leading-tight text-t-3">
					{isWords ? t("statistics.accuracy.score") : t("statistics.accuracyPhrases.score")}
				</Typography>
			</div>

			{/* Rows */}
			<div className="flex flex-col gap-2">
				<AccuracyRow
					label={isWords ? t("statistics.accuracy.correct") : t("statistics.accuracyPhrases.correct")}
					value={stats.correct.toLocaleString()}
					dotColor="bg-grn"
					statColor="text-grn"
					percent={correctPct}
					barColor="bg-grn"
				/>
				<AccuracyRow
					label={isWords ? t("statistics.accuracy.wrong") : t("statistics.accuracyPhrases.wrong")}
					value={stats.wrong.toLocaleString()}
					dotColor="bg-amb"
					statColor="text-amb"
					percent={wrongPct}
					barColor="bg-amb"
				/>

				<div className="mt-0.5 border-t border-bd-1 pt-1.5">
					<div className="flex items-center justify-between">
						<Typography tag="span" className="text-[11px] text-t-3">
							{isWords ? t("statistics.accuracy.bestStreak") : t("statistics.accuracyPhrases.bestStreak")}
						</Typography>
						<Typography tag="span" className="text-[11px] font-semibold text-t-1">
							{isWords
								? t("statistics.accuracy.bestStreakValue", { n: accuracy.bestStreak })
								: t("statistics.accuracyPhrases.bestStreakValue", { n: phraseAccuracy.bestStreak })}
						</Typography>
					</div>
					<div className="mt-1 flex items-center justify-between">
						<Typography tag="span" className="text-[11px] text-t-3">
							{isWords ? t("statistics.accuracy.sessions") : t("statistics.accuracyPhrases.total")}
						</Typography>
						<Typography tag="span" className="text-[11px] font-semibold text-t-1">
							{isWords ? accuracy.sessions.toLocaleString() : phraseAccuracy.total.toLocaleString()}
						</Typography>
					</div>
				</div>
			</div>
		</section>
	);
};
