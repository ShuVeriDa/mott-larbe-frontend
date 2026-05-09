"use client";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type { ProfileSummary, WordsBreakdown } from "@/entities/statistics";
import { ProfileCard as SettingCard } from "../profile-card";

interface WordBarProps {
	words: WordsBreakdown;
	t: (k: string) => string;
}

const WordBar = ({ words, t }: WordBarProps) => {
	const total = words.total || 1;
	const newPct = Math.round((words.new / total) * 100);
	const learningPct = Math.round((words.learning / total) * 100);
	const knownPct = Math.round((words.known / total) * 100);

	return (
		<div className="px-4 pb-3.5">
			<Typography tag="p" className="text-[11px] text-t-3 mb-2">{t("profile.stats.wordDistribution")}</Typography>
			<div className="flex h-1.5 rounded-[4px] overflow-hidden gap-px">
				<div className="bg-amb rounded-l-[4px]" style={{ flex: `0 0 ${newPct}%` }} />
				<div className="bg-acc" style={{ flex: `0 0 ${learningPct}%` }} />
				<div className="bg-grn rounded-r-[4px]" style={{ flex: `0 0 ${knownPct}%` }} />
			</div>
			<div className="flex flex-wrap gap-2.5 mt-1.5">
				{[
					{ color: "bg-amb", label: t("profile.stats.new"), count: words.new },
					{ color: "bg-acc", label: t("profile.stats.learning"), count: words.learning },
					{ color: "bg-grn", label: t("profile.stats.known"), count: words.known },
				].map(({ color, label, count }) => (
					<div key={label} className="flex items-center gap-1">
						<Typography tag="span" className={`size-[7px] rounded-[2px] shrink-0 ${color}`} />
						<Typography tag="span" className="text-[10.5px] text-t-2">
							{label}{" "}
							<Typography tag="strong" className="text-t-1">{count}</Typography>
						</Typography>
					</div>
				))}
			</div>
		</div>
	);
};

export interface StatsCardProps {
	summary: ProfileSummary;
	lang: string;
}

export const StatsCard = ({ summary, lang }: StatsCardProps) => {
	const { t } = useI18n();

	const stats = [
		{ value: summary.words.total, label: t("profile.stats.wordsInDictionary"), color: "text-acc-t" },
		{ value: summary.textsRead, label: t("profile.stats.textsRead"), color: "text-grn-t" },
		{ value: summary.streak.current, label: t("profile.stats.streakDays"), color: "text-amb-t" },
	];

	return (
		<SettingCard
			title={t("profile.stats.title")}
			noBody
			headExtra={
				<Link
					href={`/${lang}/progress`}
					className="text-[11.5px] text-acc hover:underline"
				>
					{t("profile.stats.more")} →
				</Link>
			}
		>
			<div className="grid grid-cols-3 gap-2 p-3.5">
				{stats.map(({ value, label, color }) => (
					<div
						key={label}
						className="flex flex-col items-center rounded-[9px] border-hairline border-bd-1 bg-surf-2 px-2 py-2.5"
					>
						<Typography
							tag="span"
							className={`font-display text-[20px] font-normal leading-none mb-0.5 ${color}`}
						>
							{value}
						</Typography>
						<Typography tag="span" className="text-[10px] text-t-3 text-center leading-[1.3]">{label}</Typography>
					</div>
				))}
			</div>
			<WordBar words={summary.words} t={t} />
		</SettingCard>
	);
};
