"use client";

import { ChangeEvent, useState } from "react";
import { useDebounce } from "@/shared/lib/debounce";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import { useRouter, useSearchParams } from "next/navigation";
import {
	useTextSubmissions,
	useTextSubmission,
	useTextSubmissionStats,
	useReviewTextSubmission,
} from "@/features/text-submission";
import type { TextSubmission, TextSubmissionStatus } from "@/features/text-submission";

// Admin queue shows only submitted items — DRAFT is private until owner submits.
// This constant enforces the security requirement from the plan (Step 11).
const ADMIN_VISIBLE_STATUSES: TextSubmissionStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export const useAdminTextSubmissionsPage = () => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [statusFilter, setStatusFilter] = useState<TextSubmissionStatus | undefined>(undefined);
	const [query, setQuery] = useState("");
	const [reviewComment, setReviewComment] = useState("");
	const [showDetail, setShowDetail] = useState(() => !!searchParams.get("submission"));
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(25);
	const [order, setOrder] = useState<"asc" | "desc">("desc");

	const selectedId = searchParams.get("submission");

	const debouncedQuery = useDebounce(query, 350);

	// When no explicit filter is set, restrict to ADMIN_VISIBLE_STATUSES so DRAFTs
	// never appear in the admin queue. When a specific status is chosen, honour it
	// (admin may want to filter by APPROVED/REJECTED explicitly).
	const effectiveStatus = statusFilter ?? undefined;
	const { data, isLoading, isFetching, isError } = useTextSubmissions({
		status: effectiveStatus && ADMIN_VISIBLE_STATUSES.includes(effectiveStatus)
			? effectiveStatus
			: effectiveStatus === "DRAFT"
				? ("PENDING" as TextSubmissionStatus) // DRAFT not allowed — silently fall back
				: effectiveStatus,
		q: debouncedQuery || undefined,
		limit: pageSize,
		offset: (page - 1) * pageSize,
		order,
	});

	const { data: stats } = useTextSubmissionStats();
	const { mutate: reviewMutate, isPending: isReviewing } = useReviewTextSubmission();

	const submissions = data?.data ?? [];
	const total = data?.meta.total ?? 0;
	const fromList: TextSubmission | null = submissions.find((s) => s.id === selectedId) ?? null;
	const detailQuery = useTextSubmission(selectedId ?? "");
	const selectedSubmission: TextSubmission | null = fromList ?? detailQuery.data ?? null;

	const resetPage = () => setPage(1);

	const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setStatusFilter(e.currentTarget.value ? (e.currentTarget.value as TextSubmissionStatus) : undefined);
		resetPage();
	};

	const handleQueryChange = (v: string) => {
		setQuery(v);
		resetPage();
	};

	const handleOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setOrder(e.currentTarget.value as "asc" | "desc");
		resetPage();
	};

	const setSelected = (id: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		if (id) {
			params.set("submission", id);
		} else {
			params.delete("submission");
		}
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	const handlePageChange = (p: number) => {
		setPage(p);
	};

	const handlePageSizeChange = (size: number) => {
		setPageSize(size);
		setPage(1);
	};

	const handleSelect = (id: string) => {
		setSelected(id);
		setReviewComment("");
		setShowDetail(true);
	};

	const handleBack = () => {
		setSelected(null);
		setShowDetail(false);
	};

	const handleReviewCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setReviewComment(e.currentTarget.value);
	};

	const handleApprove = () => {
		if (!selectedId) return;
		reviewMutate(
			{ id: selectedId, dto: { decision: "approve", reviewComment: reviewComment || undefined } },
			{
				onSuccess: () => { success(t("adminTextSubmissions.successApprove")); setReviewComment(""); setSelected(null); setShowDetail(false); },
				onError: () => error(t("adminTextSubmissions.errorReview")),
			},
		);
	};

	const handleReject = () => {
		if (!selectedId) return;
		reviewMutate(
			{ id: selectedId, dto: { decision: "reject", reviewComment: reviewComment || undefined } },
			{
				onSuccess: () => { success(t("adminTextSubmissions.successReject")); setReviewComment(""); setSelected(null); setShowDetail(false); },
				onError: () => error(t("adminTextSubmissions.errorReview")),
			},
		);
	};

	return {
		submissions, stats, total, isLoading, isFetching, isError,
		statusFilter, query, order,
		page, pageSize,
		selectedId, selectedSubmission,
		isDetailLoading: !fromList && detailQuery.isLoading,
		reviewComment, isReviewing, showDetail,
		handleStatusFilterChange, handleQueryChange, handleOrderChange,
		handlePageChange, handlePageSizeChange,
		handleSelect, handleBack,
		handleReviewCommentChange, handleApprove, handleReject,
		t,
	};
};
