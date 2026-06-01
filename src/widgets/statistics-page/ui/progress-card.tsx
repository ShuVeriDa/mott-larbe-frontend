"use client";
import type { PhrasesBreakdown, WordsBreakdown } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { useState } from "react";
import type { ProgressSegmentDef } from "./progress-stacked-bar";
import { ProgressStackedBar } from "./progress-stacked-bar";
import { ProgressStatRow } from "./progress-stat-row";

interface ProgressCardProps {
	words: WordsBreakdown;
	phrases: PhrasesBreakdown;
}

type Tab = "words" | "phrases";

export const ProgressCard = ({ words, phrases }: ProgressCardProps) => {
	const { t } = useI18n();
	const [tab, setTab] = useState<Tab>("words");

	const handleTabWords = () => setTab("words");
	const handleTabPhrases = () => setTab("phrases");

	const isWords = tab === "words";

	const goal = words.goal || words.total;
	const remaining = Math.max(0, goal - words.total);
	const wordsTotal = words.total || 1;
	const phrasesTotal = phrases.total || 1;

	const wordSegments: ProgressSegmentDef[] = [
		{
			key: "known",
			label: t("statistics.words.known"),
			value: words.known,
			colorClass: "bg-grn",
			textClass: "text-grn",
		},
		{
			key: "learning",
			label: t("statistics.words.learning"),
			value: words.learning,
			colorClass: "bg-acc/70",
			textClass: "text-acc",
		},
		{
			key: "new",
			label: t("statistics.words.new"),
			value: words.new,
			colorClass: "bg-amb/70",
			textClass: "text-amb",
		},
		{
			key: "remaining",
			label: t("statistics.words.remaining"),
			value: remaining,
			colorClass: "bg-surf-4",
			textClass: "text-t-3",
		},
	];

	const phraseSegments: ProgressSegmentDef[] = [
		{
			key: "known",
			label: t("statistics.phrases.known"),
			value: phrases.known,
			colorClass: "bg-grn",
			textClass: "text-grn",
		},
		{
			key: "learning",
			label: t("statistics.phrases.learning"),
			value: phrases.learning,
			colorClass: "bg-acc/70",
			textClass: "text-acc",
		},
		{
			key: "new",
			label: t("statistics.phrases.new"),
			value: phrases.new,
			colorClass: "bg-amb/70",
			textClass: "text-amb",
		},
	];

	const segments = isWords ? wordSegments : phraseSegments;
	const barTotal = isWords ? goal : phrasesTotal;
	const displayTotal = isWords ? words.total : phrases.total;

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4">
			<header className="mb-3 flex flex-wrap items-center justify-between gap-1">
				<div role="tablist" className="flex items-center gap-0.5 rounded-base bg-surf-2 p-0.5">
					<button
						role="tab"
						aria-selected={isWords}
						onClick={handleTabWords}
						className={`min-w-0 rounded-[5px] px-2.5 py-1 text-[11px] font-medium leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1 ${
							isWords ? "bg-surf text-t-1 shadow-sm" : "text-t-3 hover:text-t-2"
						}`}
					>
						{t("statistics.words.title")}
					</button>
					<button
						role="tab"
						aria-selected={!isWords}
						onClick={handleTabPhrases}
						className={`min-w-0 rounded-[5px] px-2.5 py-1 text-[11px] font-medium leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1 ${
							!isWords
								? "bg-surf text-t-1 shadow-sm"
								: "text-t-3 hover:text-t-2"
						}`}
					>
						{t("statistics.phrases.title")}
					</button>
				</div>
				<Typography tag="span" className="shrink-0 text-[11px] text-t-3">
					{isWords
						? t("statistics.words.meta", { current: words.total, goal })
						: `${phrases.total.toLocaleString()} ${t("statistics.phrases.total")}`}
				</Typography>
			</header>

			<div className="mb-3">
				<div className="mb-1.5 flex items-baseline justify-between">
					<Typography
						tag="span"
						className="font-display text-2xl font-bold leading-none text-t-1"
					>
						{displayTotal.toLocaleString()}
					</Typography>
					<Typography tag="span" className="text-[10.5px] text-t-3">
						{isWords
							? `${Math.round((words.known / wordsTotal) * 100)}% ${t("statistics.words.known").toLowerCase()}`
							: `${Math.round((phrases.known / phrasesTotal) * 100)}% ${t("statistics.phrases.known").toLowerCase()}`}
					</Typography>
				</div>
				<ProgressStackedBar segments={segments} total={barTotal} />
			</div>

			<div className="flex flex-col gap-1.5">
				{segments.map(seg => (
					<ProgressStatRow
						key={seg.key}
						label={seg.label}
						value={seg.value}
						colorClass={seg.colorClass}
						textClass={seg.textClass}
						percent={(seg.value / (isWords ? wordsTotal : phrasesTotal)) * 100}
					/>
				))}
			</div>
		</section>
	);
};
