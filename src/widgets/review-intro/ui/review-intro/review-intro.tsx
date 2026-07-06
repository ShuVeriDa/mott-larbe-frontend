"use client";

import {
	type ReviewDueWord,
	type ReviewStats,
	getPrimaryTranslation,
} from "@/entities/review";
import { ModeSelector, type SessionMode } from "@/features/session-mode";
import { useI18n } from "@/shared/lib/i18n";
import { SectionLabel } from "@/shared/ui/section-label";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/ui/tooltip";
import { Sm2Guide } from "../sm2-guide";
import { motion } from "framer-motion";
import { variants, spring } from "@/shared/lib/animation";

export interface ReviewIntroProps {
	stats: ReviewStats | undefined;
	queue: ReviewDueWord[];
	loading: boolean;
	error: boolean;
	sessionMode: SessionMode;
	onModeChange: (mode: SessionMode) => void;
	onStart: () => void;
}

const QUEUE_PREVIEW = 4;

const dotClass = (status: string) => {
	switch (status) {
		case "NEW":
			return "bg-acc";
		case "LEARNING":
		case "RELEARNING":
			return "bg-amb";
		case "REVIEW":
			return "bg-grn";
		default:
			return "bg-t-4";
	}
};

export const ReviewIntro = ({
	stats,
	queue,
	loading,
	error,
	sessionMode,
	onModeChange,
	onStart,
}: ReviewIntroProps) => {
	const { t } = useI18n();
	const dueCount = stats?.dueCount ?? 0;
	const learningCount = stats?.learningCount ?? 0;
	const knownCount = stats?.knownCount ?? 0;
	const streak = stats?.streak ?? 0;
	const remainder = Math.max(queue.length - QUEUE_PREVIEW, 0);

	return (
		<motion.section
			className="flex flex-1 flex-col items-center justify-center px-6 py-8 max-md:justify-start max-md:px-4 max-md:pt-6"
			aria-busy={loading}
			variants={variants.staggerContainer}
			initial="hidden"
			animate="visible"
		>
			<motion.div
				className="mb-5 flex gap-2.5 max-md:w-full max-md:flex-wrap max-md:gap-2"
				variants={variants.staggerContainer}
			>
				<StatBox
					value={dueCount}
					label={t("review.sm2.intro.stats.due")}
					tone="amb"
				/>
				<StatBox
					value={learningCount}
					label={t("review.sm2.intro.stats.learning")}
					tone="acc"
				/>
				<StatBox
					value={knownCount}
					label={t("review.sm2.intro.stats.known")}
					tone="grn"
					hint={t("review.sm2.intro.stats.knownHint")}
				/>
				<StatBox
					value={streak}
					label={t("review.sm2.intro.stats.streak")}
					tone="grn"
				/>
			</motion.div>

			<motion.div variants={variants.staggerItem}>
				<Typography
					tag="h2"
					className="mb-1.5 text-center font-display text-[21px] font-normal text-t-1"
				>
					{t("review.sm2.intro.title")}
				</Typography>
				<Typography className="mb-5 max-w-[340px] text-center text-[13px] leading-[1.6] text-t-3">
					{loading
						? t("review.sm2.intro.loading")
						: error
							? t("review.sm2.intro.error")
							: dueCount === 0
								? t("review.sm2.intro.empty")
								: t("review.sm2.intro.subtitle", { count: dueCount })}
				</Typography>
			</motion.div>

			<motion.div className="mb-4 w-full max-w-[420px]" variants={variants.staggerItem}>
				<ModeSelector value={sessionMode} onChange={onModeChange} />
			</motion.div>

			<motion.div variants={variants.staggerItem}>
				<Button
					variant="action"
					size="lg"
					onClick={onStart}
					disabled={loading || dueCount === 0 || queue.length === 0}
				>
					{t("review.sm2.intro.start")}
				</Button>
			</motion.div>

			{queue.length > 0 ? (
				<motion.div
					className="mt-5 w-full max-w-[420px] border-t border-bd-1 pt-4"
					variants={variants.staggerItem}
				>
					<div className="mb-2 flex items-center justify-between">
						<SectionLabel className="mb-0">
							{t("review.sm2.intro.queue.title")}
						</SectionLabel>
						<Sm2Guide />
					</div>

					<motion.ul
						className="flex flex-col gap-1"
						variants={variants.staggerContainer}
					>
						{queue.slice(0, QUEUE_PREVIEW).map(item => (
							<motion.li
								key={item.lemmaId}
								className="flex items-center gap-2.5 rounded-base border-[0.5px] border-bd-1 bg-surf px-3 py-2"
								variants={variants.staggerItem}
							>
								<Typography
									tag="span"
									aria-hidden="true"
									className={`size-1.5 shrink-0 rounded-full ${dotClass(item.status)}`}
								/>
								<Typography
									tag="span"
									className="flex-1 truncate text-[13px] font-medium text-t-1"
								>
									{item.lemma.baseForm}
								</Typography>
								<Typography
									tag="span"
									className="truncate text-[12px] text-t-3"
								>
									{getPrimaryTranslation(item.lemma)}
								</Typography>
							</motion.li>
						))}
					</motion.ul>
					{remainder > 0 ? (
						<Typography className="mt-1.5 text-center text-[11.5px] text-t-3">
							{t("review.sm2.intro.queue.more", { count: remainder })}
						</Typography>
					) : null}
				</motion.div>
			) : null}
		</motion.section>
	);
};

interface StatBoxProps {
	value: number;
	label: string;
	tone: "amb" | "acc" | "grn";
	hint?: string;
}

const toneClasses: Record<StatBoxProps["tone"], string> = {
	amb: "text-amb",
	acc: "text-acc",
	grn: "text-grn",
};

const StatBox = ({ value, label, tone, hint }: StatBoxProps) => (
	<motion.div
		className="min-w-[80px] rounded-card border-[0.5px] border-bd-2 bg-surf px-4 py-3 text-center shadow-sm max-md:min-w-0 max-md:flex-1 max-md:basis-[calc(50%-4px)]"
		variants={variants.staggerItem}
	>
		<div
			className={`font-display text-[22px] font-semibold leading-[1.1] tabular-nums max-md:text-[20px] ${toneClasses[tone]}`}
		>
			{value}
		</div>
		{hint ? (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="mt-1 cursor-help text-[11px] text-t-3 underline decoration-dotted underline-offset-2">
							{label}
						</div>
					</TooltipTrigger>
					<TooltipContent>{hint}</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		) : (
			<div className="mt-1 text-[11px] text-t-3">{label}</div>
		)}
	</motion.div>
);
