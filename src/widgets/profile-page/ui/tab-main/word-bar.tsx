"use client";

import type { WordsBreakdown } from "@/entities/statistics";
import { Typography } from "@/shared/ui/typography";

export interface WordBarProps {
	words: WordsBreakdown;
	t: (k: string) => string;
}

export const WordBar = ({ words, t }: WordBarProps) => {
	const total = words.total || 1;
	const newPct = Math.round((words.new / total) * 100);
	const learningPct = Math.round((words.learning / total) * 100);
	const knownPct = Math.round((words.known / total) * 100);

	return (
		<div className="px-4 pb-3.5">
			<Typography tag="p" className="text-[11px] text-t-3 mb-2">
				{t("profile.stats.wordDistribution")}
			</Typography>
			<div className="flex h-1.5 rounded-[4px] overflow-hidden gap-px">
				<div
					className="bg-amb rounded-l-[4px]"
					style={{ flex: `0 0 ${newPct}%` }}
				/>
				<div className="bg-acc" style={{ flex: `0 0 ${learningPct}%` }} />
				<div
					className="bg-grn rounded-r-[4px]"
					style={{ flex: `0 0 ${knownPct}%` }}
				/>
			</div>
			<div className="flex flex-wrap gap-2.5 mt-1.5">
				{[
					{ color: "bg-amb", label: t("profile.stats.new"), count: words.new },
					{
						color: "bg-acc",
						label: t("profile.stats.learning"),
						count: words.learning,
					},
					{
						color: "bg-grn",
						label: t("profile.stats.known"),
						count: words.known,
					},
				].map(({ color, label, count }) => (
					<div key={label} className="flex items-center gap-1">
						<Typography
							tag="span"
							className={`size-[7px] rounded-[2px] shrink-0 ${color}`}
						/>
						<Typography tag="span" className="text-[10.5px] text-t-2">
							{label}{" "}
							<Typography tag="strong" className="text-t-1">
								{count}
							</Typography>
						</Typography>
					</div>
				))}
			</div>
		</div>
	);
};
