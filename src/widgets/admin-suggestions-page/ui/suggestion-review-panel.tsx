"use client";

import { ChangeEvent } from "react";
import { AdminCard } from "@/shared/ui/admin-card";
import { Typography } from "@/shared/ui/typography";
import { displayValue } from "@/shared/lib/display-value";
import {
	InfoCard,
	ReviewPanelEmpty,
	ReviewPanelHeader,
	ReviewForm,
	ReviewPanelShell,
} from "@/shared/ui/review-panel";
import type { Suggestion } from "@/features/suggestions";

interface SuggestionReviewPanelProps {
	suggestion: Suggestion | null;
	comment: string;
	isPending: boolean;
	onCommentChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	onApprove: () => void;
	onReject: () => void;
	t: (key: string) => string;
}

export const SuggestionReviewPanel = ({
	suggestion, comment, isPending,
	onCommentChange, onApprove, onReject, t,
}: SuggestionReviewPanelProps) => {
	if (!suggestion) {
		return <ReviewPanelEmpty text={t("adminSuggestions.selectToReview")} hiddenOnMobile />;
	}

	const target = suggestion.text?.title ?? suggestion.entry?.rawWord ?? "—";
	const subtitle = [
		t(`suggest.fields.${suggestion.field}`),
		suggestion.user?.username ?? suggestion.user?.name ?? "—",
		new Date(suggestion.createdAt).toLocaleDateString(),
	].join(" · ");

	return (
		<ReviewPanelShell>
			<ReviewPanelHeader
				title={target}
				subtitle={subtitle}
				status={suggestion.status}
				statusLabel={t(`adminSuggestions.status.${suggestion.status}`)}
				titleClassName="font-display italic"
			/>

			{/* Diff */}
			<AdminCard className="mb-5">
				{suggestion.oldValue !== null && (
					<div className="border-b border-bd-1 px-4 py-3">
						<Typography tag="p" className="mb-1 text-[11px] font-medium uppercase tracking-wide text-t-3">
							{t("adminSuggestions.oldValue")}
						</Typography>
						<Typography tag="p" className="text-[13px] text-red/80 line-through">
							{displayValue(suggestion.oldValue)}
						</Typography>
					</div>
				)}
				<div className="px-4 py-3">
					<Typography tag="p" className="mb-1 text-[11px] font-medium uppercase tracking-wide text-t-3">
						{t("adminSuggestions.newValue")}
					</Typography>
					<Typography tag="p" className="text-[13px] text-green-600 dark:text-green-400">
						{displayValue(suggestion.newValue)}
					</Typography>
				</div>
			</AdminCard>

			{suggestion.comment && (
				<InfoCard label={t("adminSuggestions.comment")} className="mb-5">
					<Typography tag="p" className="text-[13px] italic text-t-2">{suggestion.comment}</Typography>
				</InfoCard>
			)}

			{suggestion.reviewComment && suggestion.status !== "PENDING" && (
				<InfoCard label={t("adminSuggestions.reviewComment")} className="mb-5">
					<Typography tag="p" className="text-[13px] text-t-2">{suggestion.reviewComment}</Typography>
				</InfoCard>
			)}

			{suggestion.status === "PENDING" && (
				<ReviewForm
					comment={comment}
					isPending={isPending}
					commentLabel={t("adminSuggestions.reviewComment")}
					approveLabel={t("adminSuggestions.approve")}
					rejectLabel={t("adminSuggestions.reject")}
					onCommentChange={onCommentChange}
					onApprove={onApprove}
					onReject={onReject}
					inputId="review-comment"
				/>
			)}
		</ReviewPanelShell>
	);
};
