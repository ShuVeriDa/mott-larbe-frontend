"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { variants, spring } from "@/shared/lib/animation";

export interface ReviewDoneProps {
	easy: number;
	good: number;
	hard: number;
	onBackToIntro: () => void;
	onTryDeck: () => void;
}

export const ReviewDone = ({
	easy,
	good,
	hard,
	onBackToIntro,
	onTryDeck,
}: ReviewDoneProps) => {
	const { t } = useI18n();

	return (
		<motion.section
			className="flex flex-1 flex-col items-center justify-center px-6 py-10 max-md:px-5 max-md:py-8"
			variants={variants.staggerContainer}
			initial="hidden"
			animate="visible"
		>
			<motion.div
				className="mb-4 flex size-[52px] items-center justify-center rounded-[14px] bg-grn-bg shadow-md"
				initial={{ scale: 0.5, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={spring.bouncy}
			>
				<Check className="size-[22px] text-grn" />
			</motion.div>
			<motion.div variants={variants.staggerItem}>
				<Typography
					tag="h2"
					className="mb-1.5 text-center font-display text-[21px] font-normal text-t-1"
				>
					{t("review.sm2.done.title")}
				</Typography>
				<Typography className="mb-5 max-w-[300px] text-center text-[13px] leading-[1.6] text-t-3">
					{t("review.sm2.done.subtitle")}
				</Typography>
			</motion.div>

			<motion.div
				className="mb-5 flex gap-2.5 max-md:w-full"
				variants={variants.staggerContainer}
			>
				<DoneStat
					value={easy}
					label={t("review.sm2.done.stats.easy")}
					tone="grn"
				/>
				<DoneStat
					value={good}
					label={t("review.sm2.done.stats.good")}
					tone="acc"
				/>
				<DoneStat
					value={hard}
					label={t("review.sm2.done.stats.hard")}
					tone="amb"
				/>
			</motion.div>

			<motion.div
				className="flex flex-wrap items-center justify-center gap-2"
				variants={variants.staggerItem}
			>
				<Button variant="ghost" size="lg" onClick={onBackToIntro}>
					{t("review.sm2.done.toIntro")}
				</Button>
				<Button variant="action" size="lg" onClick={onTryDeck}>
					{t("review.sm2.done.tryDeck")}
				</Button>
			</motion.div>
		</motion.section>
	);
};

interface DoneStatProps {
	value: number;
	label: string;
	tone: "grn" | "acc" | "amb";
}

const toneClasses: Record<DoneStatProps["tone"], string> = {
	grn: "text-grn",
	acc: "text-acc",
	amb: "text-amb",
};

const DoneStat = ({ value, label, tone }: DoneStatProps) => (
	<motion.div
		className="rounded-card border-[0.5px] border-bd-2 bg-surf px-4 py-3 text-center shadow-sm min-w-[78px] max-md:flex-1 max-md:min-w-0"
		variants={variants.staggerItem}
	>
		<div
			className={`font-display text-[22px] font-semibold leading-[1.1] tabular-nums ${toneClasses[tone]}`}
		>
			{value}
		</div>
		<div className="mt-0.5 text-[11px] text-t-3">{label}</div>
	</motion.div>
);
