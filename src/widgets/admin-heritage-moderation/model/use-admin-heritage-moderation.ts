"use client";

import {
	heritageApi,
	heritageKeys,
	heritageModerationStatsQueryOptions,
	nationsQueryOptions,
	pendingHeritageQueryOptions,
	tukhumQueryOptions,
	type HeritageModerationSubjectType,
	type PendingHeritageItem,
	type ReviewHeritageGaraDto,
	type ReviewHeritageTaipDto,
} from "@/entities/heritage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { ModerationTypeFilter, ReviewFormState } from "./types";

const LIMIT = 20;

const initialReviewForm: ReviewFormState = {
	action: null,
	rejectReason: "",
	addToDirectory: false,
	tukhumId: "",
	nationId: "",
	taipId: "",
};

export const useAdminHeritageModeration = () => {
	const queryClient = useQueryClient();

	const [page, setPage] = useState(1);
	const [typeFilter, setTypeFilter] = useState<ModerationTypeFilter>("ALL");
	const [selectedItem, setSelectedItem] = useState<PendingHeritageItem | null>(null);
	const [reviewForm, setReviewForm] = useState<ReviewFormState>(initialReviewForm);

	const queryType = typeFilter === "ALL" ? undefined : typeFilter as HeritageModerationSubjectType;

	const pendingQuery = useQuery(
		pendingHeritageQueryOptions({ page, limit: LIMIT, type: queryType }),
	);

	const statsQuery = useQuery(heritageModerationStatsQueryOptions());

	const nationsQuery = useQuery(nationsQueryOptions());

	const selectedTukhumNationId = reviewForm.nationId;
	const tukhumQuery = useQuery({
		...tukhumQueryOptions(selectedTukhumNationId),
		enabled: !!selectedTukhumNationId && reviewForm.addToDirectory,
	});

	const items = pendingQuery.data?.data ?? [];
	const total = pendingQuery.data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / LIMIT));
	const stats = statsQuery.data ?? { pending: 0, verified: 0, rejected: 0 };
	const nations = nationsQuery.data?.data ?? [];
	const tukhumy = tukhumQuery.data?.data ?? [];

	const invalidateModeration = () => {
		queryClient.invalidateQueries({ queryKey: heritageKeys.moderation() });
	};

	const reviewTaipMutation = useMutation({
		mutationFn: ({ heritageId, dto }: { heritageId: string; dto: ReviewHeritageTaipDto }) =>
			heritageApi.reviewTaip(heritageId, dto),
		onSuccess: () => {
			invalidateModeration();
			setSelectedItem(null);
			setReviewForm(initialReviewForm);
		},
	});

	const reviewGaraMutation = useMutation({
		mutationFn: ({ heritageId, dto }: { heritageId: string; dto: ReviewHeritageGaraDto }) =>
			heritageApi.reviewGara(heritageId, dto),
		onSuccess: () => {
			invalidateModeration();
			setSelectedItem(null);
			setReviewForm(initialReviewForm);
		},
	});

	const isPending = reviewTaipMutation.isPending || reviewGaraMutation.isPending;

	const handleSelectItem = (item: PendingHeritageItem) => {
		setSelectedItem(item);
		setReviewForm(initialReviewForm);
	};

	const handleClearSelected = () => {
		setSelectedItem(null);
		setReviewForm(initialReviewForm);
	};

	const handleTypeFilterChange = (value: ModerationTypeFilter) => {
		setTypeFilter(value);
		setPage(1);
		setSelectedItem(null);
		setReviewForm(initialReviewForm);
	};

	const handlePageChange = (p: number) => {
		setPage(p);
		setSelectedItem(null);
	};

	const handleRejectReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setReviewForm((prev) => ({ ...prev, rejectReason: e.currentTarget.value }));
	};

	const handleAddToDirectoryChange = (checked: boolean) => {
		setReviewForm((prev) => ({
			...prev,
			addToDirectory: checked,
			tukhumId: "",
			nationId: "",
			taipId: "",
		}));
	};

	const handleNationIdChange = (value: string) => {
		setReviewForm((prev) => ({ ...prev, nationId: value, tukhumId: "" }));
	};

	const handleTukhumIdChange = (value: string) => {
		setReviewForm((prev) => ({ ...prev, tukhumId: value }));
	};

	const handleTaipIdChange = (value: string) => {
		setReviewForm((prev) => ({ ...prev, taipId: value }));
	};

	const handleApprove = () => {
		if (!selectedItem) return;

		if (selectedItem.type === "TAIP") {
			const dto: ReviewHeritageTaipDto = {
				action: "verify",
				addToDirectory: reviewForm.addToDirectory,
				...(reviewForm.addToDirectory && reviewForm.nationId && { nationId: reviewForm.nationId }),
				...(reviewForm.addToDirectory && reviewForm.tukhumId && { tukhumId: reviewForm.tukhumId }),
			};
			reviewTaipMutation.mutate({ heritageId: selectedItem.heritageId, dto });
		} else {
			const dto: ReviewHeritageGaraDto = {
				action: "verify",
				addToDirectory: reviewForm.addToDirectory,
				...(reviewForm.addToDirectory && reviewForm.taipId && { taipId: reviewForm.taipId }),
			};
			reviewGaraMutation.mutate({ heritageId: selectedItem.heritageId, dto });
		}
	};

	const handleReject = () => {
		if (!selectedItem) return;

		const rejectReason = reviewForm.rejectReason.trim() || undefined;

		if (selectedItem.type === "TAIP") {
			reviewTaipMutation.mutate({
				heritageId: selectedItem.heritageId,
				dto: { action: "reject", rejectReason },
			});
		} else {
			reviewGaraMutation.mutate({
				heritageId: selectedItem.heritageId,
				dto: { action: "reject", rejectReason },
			});
		}
	};

	return {
		page,
		typeFilter,
		selectedItem,
		reviewForm,
		items,
		total,
		totalPages,
		stats,
		nations,
		tukhumy,
		LIMIT,
		isPending,
		pendingQuery,
		statsQuery,
		tukhumQuery,
		handleSelectItem,
		handleClearSelected,
		handleTypeFilterChange,
		handlePageChange,
		handleRejectReasonChange,
		handleAddToDirectoryChange,
		handleNationIdChange,
		handleTukhumIdChange,
		handleTaipIdChange,
		handleApprove,
		handleReject,
	};
};
