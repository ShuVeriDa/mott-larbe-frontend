"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import {
	type ReviewDueWord,
	type ReviewStats,
	getPrimaryTranslation,
} from "@/entities/review";

export interface ReviewIntroProps {
	stats: ReviewStats | undefined;
	queue: ReviewDueWord[];
	loading: boolean;
	error: boolean;
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
	onStart,
}: ReviewIntroProps) => {
	const { t } = useI18n();
	const dueCount = stats?.dueCount ?? 0;
	const learningCount = stats?.learningCount ?? 0;
	const streak = stats?.streak ?? 0;
	const remainder = Math.max(queue.length - QUEUE_PREVIEW, 0);

	return (
		<section
			className="flex flex-1 flex-col items-center justify-center px-6 py-8 max-md:justify-start max-md:px-5 max-md:pt-7"
			aria-busy={loading}
		>
			<div className="mb-5 flex gap-2.5 max-md:w-full max-md:gap-2">
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
					value={streak}
					label={t("review.sm2.intro.stats.streak")}
					tone="grn"
				/>
			</div>

			<Typography
				tag="h1"
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

			<Button
				variant="action"
				size="lg"
				onClick={onStart}
				disabled={loading || dueCount === 0 || queue.length === 0}
			>
				{t("review.sm2.intro.start")}
			</Button>

			{queue.length > 0 ? (
				<div className="mt-5 w-full max-w-[420px] border-t border-bd-1 pt-4">
					<Typography className="mb-2 text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3">
						{t("review.sm2.intro.queue.title")}
					</Typography>
					<ul className="flex flex-col gap-1">
						{queue.slice(0, QUEUE_PREVIEW).map((item) => (
							<li
								key={item.lemmaId}
								className="flex items-center gap-2.5 rounded-base border-hairline border-bd-1 bg-surf px-3 py-2"
							>
								<Typography tag="span"
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
							</li>
						))}
					</ul>
					{remainder > 0 ? (
						<Typography className="mt-1.5 text-center text-[11.5px] text-t-3">
							{t("review.sm2.intro.queue.more", { count: remainder })}
						</Typography>
					) : null}
				</div>
			) : null}
		</section>
	);
};

interface StatBoxProps {
	value: number;
	label: string;
	tone: "amb" | "acc" | "grn";
}

const toneClasses: Record<StatBoxProps["tone"], string> = {
	amb: "text-amb",
	acc: "text-acc",
	grn: "text-grn",
};

const StatBox = ({ value, label, tone }: StatBoxProps) => (
	<div className="rounded-card border-hairline border-bd-2 bg-surf px-4 py-3 text-center shadow-sm min-w-[80px] max-md:flex-1 max-md:min-w-0">
		<div
			className={`font-display text-[22px] font-semibold leading-[1.1] tabular-nums max-md:text-[20px] ${toneClasses[tone]}`}
		>
			{value}
		</div>
		<div className="mt-1 text-[11px] text-t-3">{label}</div>
	</div>
);
