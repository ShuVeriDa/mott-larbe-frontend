"use client";

import type { ProfileSummary } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import { ProfileCard as SettingCard } from "../profile-card";
import { WordBar } from "./word-bar";

export interface StatsCardProps {
	summary: ProfileSummary;
	lang: string;
}

export const StatsCard = ({ summary, lang }: StatsCardProps) => {
	const { t } = useI18n();

	const stats = [
		{
			value: summary.words.total,
			label: t("profile.stats.wordsInDictionary"),
			color: "text-acc-t",
		},
		{
			value: summary.textsRead,
			label: t("profile.stats.textsRead"),
			color: "text-grn-t",
		},
		{
			value: summary.streak.current,
			label: t("profile.stats.streakDays"),
			color: "text-amb-t",
		},
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
						className="flex flex-col items-center rounded-[9px] border-[0.5px] border-bd-1 bg-surf-2 px-2 py-2.5"
					>
						<Typography
							tag="span"
							className={`font-display text-[20px] font-normal leading-none mb-0.5 ${color}`}
						>
							{value}
						</Typography>
						<Typography
							tag="span"
							className="text-[11px] text-t-3 text-center leading-[1.3]"
						>
							{label}
						</Typography>
					</div>
				))}
			</div>
			<WordBar words={summary.words} t={t} />
		</SettingCard>
	);
};
