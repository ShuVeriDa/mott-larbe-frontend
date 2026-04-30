"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { LearningLevel } from "@/shared/types";
import { Typography } from "@/shared/ui/typography";
import type { DictionaryStats } from "@/entities/dictionary";

interface Row {
	key: string;
	dotClass: string;
	label: string;
	value: number;
}

export interface StatsListProps {
	stats: DictionaryStats;
}

export const StatsList = ({ stats }: StatsListProps) => {
	const { t } = useI18n();

	const rows: Row[] = (
		[
			{
				key: "NEW",
				dotClass: "bg-surf-4",
				label: t("vocabulary.status.new"),
				value: stats.byLevel.NEW,
			},
			{
				key: "LEARNING",
				dotClass: "bg-amb",
				label: t("vocabulary.status.learning"),
				value: stats.byLevel.LEARNING,
			},
			{
				key: "KNOWN",
				dotClass: "bg-grn",
				label: t("vocabulary.status.known"),
				value: stats.byLevel.KNOWN,
			},
			{
				key: "TOTAL",
				dotClass: "bg-acc",
				label: t("vocabulary.status.total"),
				value: stats.total,
			},
		] satisfies (Row & { key: LearningLevel | "TOTAL" })[]
	);

	return (
		<ul className="flex flex-col gap-[5px]">
			{rows.map((row) => (
				<Typography
					tag="li"
					key={row.key}
					className="flex items-center justify-between rounded-[8px] border-hairline border-bd-1 bg-surf-2 px-2.5 py-2 transition-colors hover:border-bd-2"
				>
					<div className="flex items-center gap-[7px]">
						<span
							aria-hidden="true"
							className={`size-[7px] rounded-full ${row.dotClass}`}
						/>
						<Typography tag="span" className="text-xs text-t-2">
							{row.label}
						</Typography>
					</div>
					<Typography tag="span" className="font-display text-[16px] text-t-1">
						{row.value}
					</Typography>
				</Typography>
			))}
		</ul>
	);
};
