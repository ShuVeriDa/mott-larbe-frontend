"use client";

import { useTextSubmission, useReviewTextSubmission } from "@/features/text-submission";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useRouter } from "next/navigation";
import type { TipTapDoc } from "@/entities/text";
import type { TextSubmissionPage } from "@/features/text-submission";

const resolvePages = (
	pages: TextSubmissionPage[] | undefined,
	contentRich: TipTapDoc | undefined,
): TextSubmissionPage[] => {
	if (pages && pages.length > 0) return pages;
	if (contentRich) return [{ id: "single", pageNumber: 1, contentRich }];
	return [];
};

export const useSubmissionPreview = (submissionId: string, pageNumber: number) => {
	const { t, lang } = useI18n();
	const { success, error } = useToast();
	const router = useRouter();

	const { data: submission, isPending, isError } = useTextSubmission(submissionId);
	const { mutate: reviewMutate, isPending: isReviewing } = useReviewTextSubmission();

	const pages = submission ? resolvePages(submission.pages, submission.contentRich as TipTapDoc | undefined) : [];
	const totalPages = pages.length;
	const currentPage = pages.find(p => p.pageNumber === pageNumber) ?? pages[0] ?? null;

	const handleApprove = () => {
		reviewMutate(
			{ id: submissionId, dto: { decision: "approve" } },
			{
				onSuccess: () => {
					success(t("adminTextSubmissions.successApprove"));
					router.back();
				},
				onError: () => error(t("adminTextSubmissions.errorReview")),
			},
		);
	};

	const handleReject = () => {
		reviewMutate(
			{ id: submissionId, dto: { decision: "reject" } },
			{
				onSuccess: () => {
					success(t("adminTextSubmissions.successReject"));
					router.back();
				},
				onError: () => error(t("adminTextSubmissions.errorReview")),
			},
		);
	};

	return {
		t,
		lang,
		submission,
		isPending,
		isError,
		pages,
		totalPages,
		currentPage,
		isReviewing,
		handleApprove,
		handleReject,
	};
};
