"use client";

import { Typography } from "@/shared/ui/typography";
import { useSubmissionPreview } from "../model/use-submission-preview";
import { SubmissionPreviewTopbar } from "./submission-preview-topbar";
import { SubmissionPreviewBody } from "./submission-preview-body";
import { SubmissionPreviewPager } from "./submission-preview-pager";

interface SubmissionPreviewPageProps {
	submissionId: string;
	lang: string;
	pageNumber: number;
}

export const SubmissionPreviewPage = ({
	submissionId,
	lang,
	pageNumber,
}: SubmissionPreviewPageProps) => {
	const {
		t,
		submission,
		isPending,
		isError,
		pages,
		totalPages,
		currentPage,
		isReviewing,
		handleApprove,
		handleReject,
	} = useSubmissionPreview(submissionId, pageNumber);
	// lang comes from page props (server-side) so router.push uses correct locale

	if (isPending) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="h-5 w-5 animate-spin rounded-full border-2 border-bd-2 border-t-acc" />
			</div>
		);
	}

	if (isError || !submission) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Typography tag="p" className="text-t-3">
					{t("adminTextSubmissions.preview.error")}
				</Typography>
			</div>
		);
	}

	if (pages.length === 0) {
		return (
			<div className="flex h-screen flex-col overflow-hidden bg-surf">
				<SubmissionPreviewTopbar
					lang={lang}
					submission={submission}
					isReviewing={isReviewing}
					onApprove={handleApprove}
					onReject={handleReject}
					t={t}
				/>
				<div className="mx-auto w-full max-w-[720px] px-6 py-10">
					<Typography tag="p" className="mb-4 text-[15px] text-t-2">
						{t("adminTextSubmissions.preview.noContent")}
					</Typography>
					{submission.sourceUrl && (
						<a
							href={submission.sourceUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 text-[13px] text-acc hover:underline break-all"
						>
							{submission.sourceUrl}
						</a>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-surf">
			<SubmissionPreviewTopbar
				lang={lang}
				submission={submission}
				isReviewing={isReviewing}
				onApprove={handleApprove}
				onReject={handleReject}
				t={t}
			/>

			<div className="flex-1 overflow-y-auto">
				{currentPage && (
					<SubmissionPreviewBody
						page={currentPage}
						pageNumber={pageNumber}
						totalPages={totalPages}
					/>
				)}
			</div>

			<SubmissionPreviewPager
				submissionId={submissionId}
				lang={lang}
				currentPageNumber={pageNumber}
				totalPages={totalPages}
				t={t}
			/>
		</div>
	);
};
