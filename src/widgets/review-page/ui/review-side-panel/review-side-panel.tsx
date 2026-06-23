"use client";

import { useI18n } from "@/shared/lib/i18n";
import { SectionLabel } from "@/shared/ui/section-label";
import { Typography } from "@/shared/ui/typography";
import { getPrimaryTranslation, type ReviewDueWord } from "@/entities/review";
import type { ReviewSystem } from "../review-topbar";
import type { ReviewScreen } from "../../model";
import { StatRow } from "./stat-row";
import { motion } from "framer-motion";
import { variants } from "@/shared/lib/animation";

interface Sm2Counts {
	easy: number;
	good: number;
	hard: number;
}

interface DeckCounts {
	know: number;
	again: number;
}

export interface ReviewSidePanelProps {
	system: ReviewSystem;
	screen: ReviewScreen;
	streak: number;
	sm2Counts: Sm2Counts;
	deckCounts: DeckCounts;
	nextWords: ReviewDueWord[];
}

export const ReviewSidePanel = ({
	system,
	screen,
	streak,
	sm2Counts,
	deckCounts,
	nextWords,
}: ReviewSidePanelProps) => {
	const { t } = useI18n();

	const sm2Passed = sm2Counts.easy + sm2Counts.good + sm2Counts.hard;
	const deckPassed = deckCounts.know + deckCounts.again;

	return (
		<aside className="hidden w-[220px] shrink-0 flex-col gap-3 overflow-y-auto border-l border-bd-1 bg-surf px-4 py-5 lg:flex">
			<SectionLabel className="mb-0">
				{system === "sm2"
					? t("review.sidePanel.sm2Title")
					: t("review.sidePanel.deckTitle")}
			</SectionLabel>

			{system === "sm2" && screen === "card" ? (
				<motion.div
					variants={variants.staggerContainer}
					initial="hidden"
					animate="visible"
					className="flex flex-col gap-1"
				>
					<motion.div variants={variants.staggerItem}>
						<StatRow
							label={t("review.sidePanel.passed")}
							value={sm2Passed}
							tone="neu"
						/>
					</motion.div>
					<div className="flex flex-col gap-1">
						<motion.div variants={variants.staggerItem}>
							<StatRow label={t("review.sidePanel.easy")} value={sm2Counts.easy} tone="grn" />
						</motion.div>
						<motion.div variants={variants.staggerItem}>
							<StatRow label={t("review.sidePanel.good")} value={sm2Counts.good} tone="acc" />
						</motion.div>
						<motion.div variants={variants.staggerItem}>
							<StatRow label={t("review.sidePanel.hard")} value={sm2Counts.hard} tone="amb" />
						</motion.div>
					</div>
				</motion.div>
			) : null}

			{system === "deck" && screen === "card" ? (
				<motion.div
					className="flex flex-col gap-1"
					variants={variants.staggerContainer}
					initial="hidden"
					animate="visible"
				>
					<motion.div variants={variants.staggerItem}>
						<StatRow label={t("review.sidePanel.know")} value={deckCounts.know} tone="grn" />
					</motion.div>
					<motion.div variants={variants.staggerItem}>
						<StatRow label={t("review.sidePanel.again")} value={deckCounts.again} tone="amb" />
					</motion.div>
					{deckPassed > 0 ? (
						<motion.div variants={variants.staggerItem}>
							<StatRow label={t("review.sidePanel.passed")} value={deckPassed} tone="neu" />
						</motion.div>
					) : null}
				</motion.div>
			) : null}

			{system === "sm2" ? (
				<>
					<motion.div
						className="border-t border-bd-1 pt-3"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
					>
						<SectionLabel className="mb-1.5">
							{t("review.sidePanel.streakTitle")}
						</SectionLabel>
						<div className="flex items-center gap-1.5">
							<Typography tag="span" aria-hidden="true" className="text-[16px]">🔥</Typography>
							<Typography className="text-[13px] font-semibold text-t-1">
								{t("review.sidePanel.streakDays", { n: streak })}
							</Typography>
						</div>
					</motion.div>

					{nextWords.length > 0 ? (
						<motion.div
							className="border-t border-bd-1 pt-3"
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
						>
							<SectionLabel>
								{t("review.sm2.intro.queue.title")}
							</SectionLabel>
							<motion.ul
								className="flex flex-col gap-1"
								variants={variants.staggerContainer}
								initial="hidden"
								animate="visible"
							>
								{nextWords.map((word) => (
									<motion.li
										key={word.lemmaId}
										className="flex items-center gap-1.5 rounded-base px-2 py-1.5 hover:bg-surf-2 transition-colors duration-150"
										variants={variants.staggerItem}
									>
										<Typography
											tag="span"
											className="min-w-0 flex-1 truncate text-[12px] font-medium text-t-1"
										>
											{word.lemma.baseForm}
										</Typography>
										<Typography
											tag="span"
											className="shrink-0 truncate text-[11px] text-t-3"
										>
											{getPrimaryTranslation(word.lemma)}
										</Typography>
									</motion.li>
								))}
							</motion.ul>
						</motion.div>
					) : null}
				</>
			) : null}
		</aside>
	);
};
