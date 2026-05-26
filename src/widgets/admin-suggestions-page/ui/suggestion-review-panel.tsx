"use client";

import type { Suggestion } from "@/features/suggestions";
import { Button } from "@/shared/ui/button";
import { InputLabel } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Typography } from "@/shared/ui/typography";
import { SuggestionStatusBadge } from "@/widgets/suggestions-page/ui/suggestion-status-badge";
import { CheckCircle, Inbox, XCircle } from "lucide-react";
import { ChangeEvent } from "react";

const displayValue = (raw: string | null) => {
	if (!raw) return "—";
	try {
		const parsed = JSON.parse(raw);
		return typeof parsed === "string" ? parsed : JSON.stringify(parsed);
	} catch {
		return raw;
	}
};

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
	suggestion,
	comment,
	isPending,
	onCommentChange,
	onApprove,
	onReject,
	t,
}: SuggestionReviewPanelProps) => {
	if (!suggestion) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
				<Inbox className="size-10 text-t-4" />
				<Typography tag="p" className="text-[13px] text-t-3">
					{t("adminSuggestions.selectToReview")}
				</Typography>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col overflow-y-auto p-5 max-sm:p-4">
			{/* Header */}
			<div className="mb-5 flex items-start justify-between gap-3">
				<div>
					<Typography
						tag="p"
						className="font-display text-[20px] font-semibold italic text-t-1"
					>
						{suggestion.entry?.rawWord ?? "—"}
					</Typography>
					<Typography tag="p" className="mt-1 text-[12px] text-t-3">
						{t(`suggest.fields.${suggestion.field}`)}
						{" · "}
						{suggestion.user?.username ?? suggestion.user?.name ?? "—"}
						{" · "}
						{new Date(suggestion.createdAt).toLocaleDateString()}
					</Typography>
				</div>
				<SuggestionStatusBadge
					status={suggestion.status}
					label={t(`adminSuggestions.status.${suggestion.status}`)}
				/>
			</div>

			{/* Diff */}
			<div className="mb-5 overflow-hidden rounded-card border border-bd-1 bg-surf">
				{suggestion.oldValue !== null && (
					<div className="border-b border-bd-1 px-4 py-3">
						<Typography
							tag="p"
							className="mb-1 text-[11px] font-medium uppercase tracking-wide text-t-3"
						>
							{t("adminSuggestions.oldValue")}
						</Typography>
						<Typography
							tag="p"
							className="text-[13px] text-red/80 line-through"
						>
							{displayValue(suggestion.oldValue)}
						</Typography>
					</div>
				)}
				<div className="px-4 py-3">
					<Typography
						tag="p"
						className="mb-1 text-[11px] font-medium uppercase tracking-wide text-t-3"
					>
						{t("adminSuggestions.newValue")}
					</Typography>
					<Typography
						tag="p"
						className="text-[13px] text-green-600 dark:text-green-400"
					>
						{displayValue(suggestion.newValue)}
					</Typography>
				</div>
			</div>

			{/* User comment */}
			{suggestion.comment && (
				<div className="mb-5 rounded-card border border-bd-1 bg-surf px-4 py-3">
					<Typography
						tag="p"
						className="mb-1 text-[11px] font-medium uppercase tracking-wide text-t-3"
					>
						{t("adminSuggestions.comment")}
					</Typography>
					<Typography tag="p" className="text-[13px] italic text-t-2">
						{suggestion.comment}
					</Typography>
				</div>
			)}

			{/* Reviewer comment (read-only if already reviewed) */}
			{suggestion.reviewComment && suggestion.status !== "PENDING" && (
				<div className="mb-5 rounded-card border border-bd-1 bg-surf px-4 py-3">
					<Typography
						tag="p"
						className="mb-1 text-[11px] font-medium uppercase tracking-wide text-t-3"
					>
						{t("adminSuggestions.reviewComment")}
					</Typography>
					<Typography tag="p" className="text-[13px] text-t-2">
						{suggestion.reviewComment}
					</Typography>
				</div>
			)}

			{/* Review form — only for PENDING */}
			{suggestion.status === "PENDING" && (
				<div className="mt-auto">
					<div className="mb-3">
						<InputLabel htmlFor="review-comment">
							{t("adminSuggestions.reviewComment")}
						</InputLabel>
						<Textarea
							id="review-comment"
							value={comment}
							onChange={onCommentChange}
							rows={2}
							disabled={isPending}
						/>
					</div>
					<div className="flex gap-2">
						<Button
							type="button"
							onClick={onReject}
							disabled={isPending}
							className="flex h-[34px] flex-1 items-center justify-center gap-1.5 rounded-lg border-[0.5px] border-bd-1 bg-surf-2 text-[13px] font-medium text-t-2 transition-colors hover:bg-red-bg hover:text-red-t hover:border-red/30 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<XCircle className="size-3.5" />
							{t("adminSuggestions.reject")}
						</Button>
						<Button
							type="button"
							onClick={onApprove}
							disabled={isPending}
							className="flex h-[34px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<CheckCircle className="size-3.5" />
							{t("adminSuggestions.approve")}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};
