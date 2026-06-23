"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { variants, spring } from "@/shared/lib/animation";

export interface ReviewDeckDoneProps {
	know: number;
	again: number;
	onBack: () => void;
	onGoSm2: () => void;
	onRetry?: () => void;
}

export const ReviewDeckDone = ({
	know,
	again,
	onBack,
	onGoSm2,
	onRetry,
}: ReviewDeckDoneProps) => {
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
					{t("review.deck.done.title")}
				</Typography>
				<Typography className="mb-5 max-w-[300px] text-center text-[13px] leading-[1.6] text-t-3">
					{t("review.deck.done.subtitle")}
				</Typography>
			</motion.div>

			<motion.div
				className="mb-5 flex gap-2.5 max-md:w-full"
				variants={variants.staggerContainer}
			>
				<Stat
					value={know}
					label={t("review.deck.done.stats.know")}
					tone="grn"
				/>
				<Stat
					value={again}
					label={t("review.deck.done.stats.again")}
					tone="amb"
				/>
			</motion.div>

			{again > 0 && onRetry ? (
				<motion.div variants={variants.staggerItem}>
					<Button
						variant="outline"
						size="lg"
						onClick={onRetry}
						className="mb-3 w-full max-w-[280px] border-amb/30 text-amb hover:border-amb/50 hover:bg-amb-bg"
					>
						{t("review.deck.done.retry", { count: again })}
					</Button>
				</motion.div>
			) : null}

			<motion.div
				className="flex flex-wrap items-center justify-center gap-2"
				variants={variants.staggerItem}
			>
				<Button variant="ghost" size="lg" onClick={onBack}>
					{t("review.deck.done.toIntro")}
				</Button>
				<Button variant="action" size="lg" onClick={onGoSm2}>
					{t("review.deck.done.toSm2")}
				</Button>
			</motion.div>
		</motion.section>
	);
};

interface StatProps {
	value: number;
	label: string;
	tone: "grn" | "amb";
}

const toneClasses: Record<StatProps["tone"], string> = {
	grn: "text-grn",
	amb: "text-amb",
};

const Stat = ({ value, label, tone }: StatProps) => (
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
