"use client";

import { ChangeEvent } from "react";
import { ExternalLink } from "lucide-react";
import { Suspense } from "react";
import { Typography } from "@/shared/ui/typography";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { NotionEditor } from "@/shared/ui/notion-editor";
import {
	InfoCard,
	ReviewPanelEmpty,
	ReviewPanelHeader,
	ReviewForm,
	ReviewPanelShell,
} from "@/shared/ui/review-panel";
import type { TextSubmission } from "@/features/text-submission";
import { TextSubmissionSubmissionTypeBadge } from "./text-submission-submission-type-badge";
import { TextSubmissionLicenseInfo } from "./text-submission-license-info";

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

// C2 fallback: renders contentRich first, falls back to plain content/sourceUrl
// Wrapped in ErrorBoundary so malformed TipTap JSON cannot crash the panel (m4)
const RichContentFallback = ({ content }: { content?: string }) => (
	<Typography tag="p" className="whitespace-pre-wrap text-[13px] text-t-2 leading-relaxed">
		{content
			? content.length > MAX_CONTENT_PREVIEW
				? content.slice(0, MAX_CONTENT_PREVIEW) + "…"
				: content
			: "—"}
	</Typography>
);

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

	// C2 fallback rule: use contentRich first, fall back to plain content string
	const hasRichContent =
		submission.contentRich !== null &&
		submission.contentRich !== undefined &&
		typeof submission.contentRich === "object" &&
		"type" in (submission.contentRich as object);

	const contentPreview =
		!hasRichContent && submission.content
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

			{/* Submission type chip — helps admin apply correct review criteria */}
			<div className="mb-4 flex items-center gap-2">
				<TextSubmissionSubmissionTypeBadge
					submissionType={submission.submissionType}
					t={t}
				/>
			</div>

			{/* License info — only relevant for EXTERNAL */}
			{submission.submissionType === "EXTERNAL" && (
				<TextSubmissionLicenseInfo
					licenseType={submission.licenseType}
					publicationYear={submission.publicationYear}
					t={t}
				/>
			)}

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

			{/* Content — C2 fallback: contentRich first, plain content as fallback (m4 ErrorBoundary) */}
			<InfoCard label={t("adminTextSubmissions.fields.content")} className="mb-4">
				{hasRichContent ? (
					<ErrorBoundary fallback={<RichContentFallback content={submission.content} />}>
						<Suspense fallback={<RichContentFallback content={submission.content} />}>
							<div className="pointer-events-none select-text max-h-80 overflow-y-auto">
								<NotionEditor
									content={submission.contentRich!}
									onUpdate={() => undefined}
									slashMenuItems={[]}
									minHeight="auto"
								/>
							</div>
						</Suspense>
					</ErrorBoundary>
				) : (
					<RichContentFallback content={submission.content} />
				)}
			</InfoCard>

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
