"use client";

import { ExternalLink } from "lucide-react";
import { Typography } from "@/shared/ui/typography";
import {
	InfoCard,
	ReviewPanelEmpty,
	ReviewPanelHeader,
	ReviewPanelShell,
} from "@/shared/ui/review-panel";
import { useI18n } from "@/shared/lib/i18n";
import type { TextSubmission } from "@/features/text-submission";

interface TextSubmissionDetailPanelProps {
	submission: TextSubmission | null;
	showDetail: boolean;
	onBack: () => void;
}

export const TextSubmissionDetailPanel = ({ submission, showDetail, onBack }: TextSubmissionDetailPanelProps) => {
	const { t } = useI18n();

	if (!submission) {
		return <ReviewPanelEmpty text={t("myTextSubmissions.selectToView")} hiddenOnMobile />;
	}

	const subtitleParts = [
		submission.language.toUpperCase(),
		...(submission.author ? [submission.author] : []),
		new Date(submission.createdAt).toLocaleDateString(),
	];

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
				statusLabel={t(`myTextSubmissions.status.${submission.status}`)}
			/>

			{submission.sourceUrl && (
				<InfoCard label={t("myTextSubmissions.sourceUrl")} className="mb-4 bg-surf-2 border-bd-1">
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
				<InfoCard label={t("adminTextSubmissions.fields.comment")} className="mb-4 bg-surf-2 border-bd-1">
					<Typography tag="p" className="text-[13px] italic text-t-2">{submission.comment}</Typography>
				</InfoCard>
			)}

			{submission.reviewComment && submission.status !== "PENDING" && (
				<InfoCard label={t("myTextSubmissions.reviewComment")} className="bg-surf-2 border-bd-1">
					<Typography tag="p" className="text-[13px] text-t-2">{submission.reviewComment}</Typography>
				</InfoCard>
			)}
		</ReviewPanelShell>
	);
};
