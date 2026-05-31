"use client";

import { ChangeEvent } from "react";
import { ExternalLink } from "lucide-react";
import { Typography } from "@/shared/ui/typography";
import {
	InfoCard,
	ReviewPanelEmpty,
	ReviewPanelHeader,
	ReviewForm,
	ReviewPanelShell,
} from "@/shared/ui/review-panel";
import type { TextSubmission } from "@/features/text-submission";

const MAX_CONTENT_PREVIEW = 500;

interface TextSubmissionReviewPanelProps {
	submission: TextSubmission | null;
	comment: string;
	isPending: boolean;
	showDetail: boolean;
	onCommentChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	onApprove: () => void;
	onReject: () => void;
	onBack: () => void;
	t: (key: string) => string;
}

export const TextSubmissionReviewPanel = ({
	submission, comment, isPending, showDetail,
	onCommentChange, onApprove, onReject, onBack, t,
}: TextSubmissionReviewPanelProps) => {
	if (!submission) {
		return <ReviewPanelEmpty text={t("adminTextSubmissions.selectToReview")} hiddenOnMobile />;
	}

	const subtitleParts = [
		submission.language.toUpperCase(),
		...(submission.author ? [submission.author] : []),
		submission.user?.username ?? submission.user?.name ?? "—",
		new Date(submission.createdAt).toLocaleDateString(),
	];

	const contentPreview = submission.content
		? submission.content.length > MAX_CONTENT_PREVIEW
			? submission.content.slice(0, MAX_CONTENT_PREVIEW) + "…"
			: submission.content
		: null;

	return (
		<ReviewPanelShell
			mobileOverlay
			showDetail={showDetail}
			onBack={onBack}
			backLabel={t("adminTextSubmissions.back")}
		>
			<ReviewPanelHeader
				title={submission.title}
				subtitle={subtitleParts.join(" · ")}
				status={submission.status}
				statusLabel={t(`adminTextSubmissions.status.${submission.status}`)}
			/>

			{submission.sourceUrl && (
				<InfoCard label={t("adminTextSubmissions.fields.sourceUrl")} className="mb-4">
					<a
						href={submission.sourceUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 text-[13px] text-acc hover:underline break-all"
					>
						<ExternalLink className="size-3.5 shrink-0" />
						{submission.sourceUrl}
					</a>
				</InfoCard>
			)}

			{contentPreview && (
				<InfoCard label={t("adminTextSubmissions.fields.content")} className="mb-4">
					<Typography tag="p" className="whitespace-pre-wrap text-[13px] text-t-2 leading-relaxed">
						{contentPreview}
					</Typography>
				</InfoCard>
			)}

			{submission.comment && (
				<InfoCard label={t("adminTextSubmissions.fields.comment")} className="mb-4">
					<Typography tag="p" className="text-[13px] italic text-t-2">{submission.comment}</Typography>
				</InfoCard>
			)}

			{submission.reviewComment && submission.status !== "PENDING" && (
				<InfoCard label={t("adminTextSubmissions.fields.reviewComment")} className="mb-4">
					<Typography tag="p" className="text-[13px] text-t-2">{submission.reviewComment}</Typography>
				</InfoCard>
			)}

			{submission.status === "PENDING" && (
				<ReviewForm
					comment={comment}
					isPending={isPending}
					commentLabel={t("adminTextSubmissions.fields.reviewComment")}
					approveLabel={t("adminTextSubmissions.approve")}
					rejectLabel={t("adminTextSubmissions.reject")}
					onCommentChange={onCommentChange}
					onApprove={onApprove}
					onReject={onReject}
					inputId="ts-review-comment"
				/>
			)}
		</ReviewPanelShell>
	);
};
