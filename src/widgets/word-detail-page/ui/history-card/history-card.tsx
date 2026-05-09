"use client";

import { Typography } from "@/shared/ui/typography";

import { Check, X } from "lucide-react";
import type { DetailReviewLog } from "@/entities/dictionary";
import { cn } from "@/shared/lib/cn";
import { formatNextReview } from "@/shared/lib/format-relative-time";
import { useI18n } from "@/shared/lib/i18n";
import { CardSection } from "../card-section";

export interface HistoryCardProps {
	logs: DetailReviewLog[];
}

export const HistoryCard = ({ logs }: HistoryCardProps) => {
	const { t, lang } = useI18n();

	if (logs.length === 0) {
		return (
			<CardSection
				title={t("vocabulary.wordDetail.sections.history")}
				bodyClassName="px-4 py-3"
			>
				<Typography tag="p" className="text-[12.5px] text-t-3">
					{t("vocabulary.wordDetail.history.empty")}
				</Typography>
			</CardSection>
		);
	}

	return (
		<CardSection
			title={t("vocabulary.wordDetail.sections.history")}
			bodyClassName="px-4 py-2"
		>
			<ul className="flex flex-col">
				{logs.map((log) => {
					const correct = log.correct;
					const delta = log.intervalDelta;
					return (
						<li
							key={log.id}
							className="flex items-center gap-2.5 border-b border-hairline border-bd-1 py-1.5 last:border-b-0"
						>
							<Typography tag="span"
								className={cn(
									"flex size-[26px] shrink-0 items-center justify-center rounded-[6px]",
									correct ? "bg-grn-bg text-grn" : "bg-red-bg text-red",
								)}
							>
								{correct ? (
									<Check className="size-3" strokeWidth={2} />
								) : (
									<X className="size-3" strokeWidth={2} />
								)}
							</Typography>
							<div className="min-w-0 flex-1">
								<Typography tag="p" className="text-[12.5px] text-t-1">
									{correct
										? t("vocabulary.wordDetail.history.success")
										: t("vocabulary.wordDetail.history.fail")}
								</Typography>
								<Typography tag="p" className="text-[11px] text-t-3">
									{formatNextReview(log.createdAt, t, lang)}
								</Typography>
							</div>
							<Typography tag="span"
								className={cn(
									"ml-auto text-[12px] font-semibold",
									correct ? "text-grn" : "text-red-t",
								)}
							>
								{!correct
									? t("vocabulary.wordDetail.history.reset")
									: delta != null && delta >= 0
										? t("vocabulary.wordDetail.history.deltaDays", { n: delta })
										: delta != null
											? t("vocabulary.wordDetail.history.deltaDaysNeg", {
													n: delta,
												})
											: ""}
							</Typography>
						</li>
					);
				})}
			</ul>
		</CardSection>
	);
};
