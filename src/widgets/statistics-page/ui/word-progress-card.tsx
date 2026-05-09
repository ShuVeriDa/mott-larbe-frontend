"use client";
import type { WordsBreakdown } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface WordProgressCardProps {
	words: WordsBreakdown;
}

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface LegendRowProps {
	label: string;
	value: number;
	colorClass: string;
	percent: number;
}

const LegendRow = ({ label, value, colorClass, percent }: LegendRowProps) => (
	<div>
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-1.5 text-[11.5px] text-t-2">
				<span className={`size-2 shrink-0 rounded-full ${colorClass}`} />
				{label}
			</div>
			<Typography tag="span" className="text-xs font-semibold text-t-1">
				{value.toLocaleString()}
			</Typography>
		</div>
		<div className="mt-0.5 h-[3px] overflow-hidden rounded-[2px] bg-surf-3">
			<div
				className={`h-full rounded-[2px] ${colorClass}`}
				style={{ width: `${Math.min(100, percent)}%` }}
			/>
		</div>
	</div>
);

export const WordProgressCard = ({ words }: WordProgressCardProps) => {
	const { t } = useI18n();
	const known = words.known;
	const learning = words.learning;
	const isNew = words.new;
	const total = words.total || 1;
	const goal = words.goal || total;
	const remaining = Math.max(0, goal - words.total);

	const ratios = {
		known: known / total,
		learning: learning / total,
		new: isNew / total,
	};

	const knownDash = ratios.known * CIRCUMFERENCE;
	const learningDash = ratios.learning * CIRCUMFERENCE;
	const newDash = ratios.new * CIRCUMFERENCE;

	return (
		<section className="rounded-card border-hairline border-bd-1 bg-surf p-4">
			<header className="mb-3 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.words.title")}
				</Typography>
				<span className="text-[11px] text-t-3">
					{t("statistics.words.meta", {
						current: words.total,
						goal,
					})}
				</span>
			</header>

			<div className="flex items-center gap-4">
				<div
					className="relative size-[88px] shrink-0"
					role="img"
					aria-label={t("statistics.words.meta", {
						current: words.total,
						goal,
					})}
				>
					<svg
						viewBox="0 0 88 88"
						className="size-[88px] -rotate-90"
						aria-hidden="true"
					>
						<circle
							cx="44"
							cy="44"
							r={RADIUS}
							fill="none"
							strokeWidth="10"
							stroke="var(--surf-3)"
						/>
						<circle
							cx="44"
							cy="44"
							r={RADIUS}
							fill="none"
							strokeWidth="10"
							stroke="var(--grn)"
							strokeDasharray={`${knownDash} ${CIRCUMFERENCE}`}
							strokeLinecap="round"
						/>
						<circle
							cx="44"
							cy="44"
							r={RADIUS}
							fill="none"
							strokeWidth="10"
							stroke="var(--acc)"
							strokeDasharray={`${learningDash} ${CIRCUMFERENCE}`}
							strokeDashoffset={-knownDash}
							strokeLinecap="round"
							opacity="0.7"
						/>
						<circle
							cx="44"
							cy="44"
							r={RADIUS}
							fill="none"
							strokeWidth="10"
							stroke="var(--amb)"
							strokeDasharray={`${newDash} ${CIRCUMFERENCE}`}
							strokeDashoffset={-(knownDash + learningDash)}
							strokeLinecap="round"
							opacity="0.7"
						/>
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<Typography
							tag="span"
							className="font-display text-lg leading-none text-t-1"
						>
							{words.total.toLocaleString()}
						</Typography>
						<span className="mt-0.5 text-[9px] text-t-3">
							{t("statistics.words.unitShort")}
						</span>
					</div>
				</div>

				<div className="flex flex-1 flex-col gap-1.5">
					<LegendRow
						label={t("statistics.words.known")}
						value={known}
						colorClass="bg-grn"
						percent={ratios.known * 100}
					/>
					<LegendRow
						label={t("statistics.words.learning")}
						value={learning}
						colorClass="bg-acc"
						percent={ratios.learning * 100}
					/>
					<LegendRow
						label={t("statistics.words.new")}
						value={isNew}
						colorClass="bg-amb"
						percent={ratios.new * 100}
					/>
					<div className="mt-1.5 border-t border-bd-1 pt-1.5">
						<LegendRow
							label={t("statistics.words.remaining")}
							value={remaining}
							colorClass="bg-surf-4"
							percent={(remaining / goal) * 100}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};
