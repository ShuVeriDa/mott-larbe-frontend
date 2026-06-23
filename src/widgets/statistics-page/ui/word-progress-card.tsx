"use client";
import type { WordsBreakdown } from "@/entities/statistics";
import { ease, duration } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { motion } from "framer-motion";
import { WordLegendRow } from "./word-legend-row";

interface WordProgressCardProps {
	words: WordsBreakdown;
}

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4">
			<header className="mb-3 gap-1 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.words.title")}
				</Typography>
				<Typography tag="span" className="text-[11px] text-t-3">
					{t("statistics.words.meta", {
						current: words.total,
						goal,
					})}
				</Typography>
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
						<motion.circle
							cx="44"
							cy="44"
							r={RADIUS}
							fill="none"
							strokeWidth="10"
							stroke="var(--grn)"
							strokeLinecap="round"
							initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
							animate={{ strokeDasharray: `${knownDash} ${CIRCUMFERENCE}` }}
							transition={{ duration: duration.slow, ease: ease.enter, delay: 0.1 }}
						/>
						<motion.circle
							cx="44"
							cy="44"
							r={RADIUS}
							fill="none"
							strokeWidth="10"
							stroke="var(--acc)"
							strokeDashoffset={-knownDash}
							strokeLinecap="round"
							opacity="0.7"
							initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
							animate={{ strokeDasharray: `${learningDash} ${CIRCUMFERENCE}` }}
							transition={{ duration: duration.slow, ease: ease.enter, delay: 0.2 }}
						/>
						<motion.circle
							cx="44"
							cy="44"
							r={RADIUS}
							fill="none"
							strokeWidth="10"
							stroke="var(--amb)"
							strokeDashoffset={-(knownDash + learningDash)}
							strokeLinecap="round"
							opacity="0.7"
							initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
							animate={{ strokeDasharray: `${newDash} ${CIRCUMFERENCE}` }}
							transition={{ duration: duration.slow, ease: ease.enter, delay: 0.3 }}
						/>
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<Typography
							tag="span"
							className="font-display text-lg leading-none text-t-1"
						>
							{words.total.toLocaleString()}
						</Typography>
						<Typography tag="span" className="mt-0.5 text-[9px] text-t-3">
							{t("statistics.words.unitShort")}
						</Typography>
					</div>
				</div>

				<div className="flex flex-1 flex-col gap-1.5">
					<WordLegendRow
						label={t("statistics.words.known")}
						value={known}
						colorClass="bg-grn"
						percent={ratios.known * 100}
					/>
					<WordLegendRow
						label={t("statistics.words.learning")}
						value={learning}
						colorClass="bg-acc"
						percent={ratios.learning * 100}
					/>
					<WordLegendRow
						label={t("statistics.words.new")}
						value={isNew}
						colorClass="bg-amb"
						percent={ratios.new * 100}
					/>
					<div className="mt-1.5 border-t border-bd-1 pt-1.5">
						<WordLegendRow
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
