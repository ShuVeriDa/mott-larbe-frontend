"use client";

import { ChangeEvent } from "react";
import { ExternalLink, FileEdit, BookOpen } from "lucide-react";
import Link from "next/link";
import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
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
	const { lang } = useI18n();

	if (!submission) {
		return <ReviewPanelEmpty text={t("adminTextSubmissions.selectToReview")} hiddenOnMobile />;
	}

	const subtitleParts = [
		submission.language.toUpperCase(),
		...(submission.author ? [submission.author] : []),
		submission.user?.username ?? submission.user?.name ?? "—",
		new Date(submission.createdAt).toLocaleDateString(),
	];

	return (
		<ReviewPanelShell
			mobileOverlay
			showDetail={showDetail}
			onBack={onBack}
			backLabel={t("adminTextSubmissions.back")}
		>
			<div className="mb-4 flex items-start justify-between gap-3">
				<div className="min-w-0 flex-1">
					<ReviewPanelHeader
						title={submission.title}
						subtitle={subtitleParts.join(" · ")}
						status={submission.status}
						statusLabel={t(`adminTextSubmissions.status.${submission.status}`)}
					/>
					<div className="mt-2">
						<TextSubmissionSubmissionTypeBadge
							submissionType={submission.submissionType}
							t={t}
						/>
					</div>
				</div>
				<Button asChild variant="ghost" className="shrink-0 gap-1.5">
					<Link href={`/${lang}/admin/text-submissions/${submission.id}/preview`}>
						<BookOpen className="size-3.5" />
						{t("adminTextSubmissions.preview.read")}
					</Link>
				</Button>
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

			{submission.status === "APPROVED" && submission.textId && (
				<InfoCard label={t("adminTextSubmissions.fields.createdText")} className="mb-4">
					<Link
						href={`/admin/texts/${submission.textId}/edit`}
						className="flex items-center gap-1.5 text-[13px] text-acc hover:underline"
					>
						<FileEdit className="size-3.5 shrink-0" />
						{t("adminTextSubmissions.openDraft")}
					</Link>
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
