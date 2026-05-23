"use client";

import { useMySuggestions } from "@/features/suggestions";
import type { SuggestionStatus } from "@/features/suggestions";
import { useState } from "react";

export const useSuggestionsPage = () => {
	const [statusFilter, setStatusFilter] = useState<SuggestionStatus | undefined>(undefined);

	const { data, isLoading, isError } = useMySuggestions({
		status: statusFilter,
		limit: 50,
		offset: 0,
	});

	const suggestions = data?.data ?? [];

	const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const val = e.currentTarget.value;
		setStatusFilter(val ? (val as SuggestionStatus) : undefined);
	};

	return {
		suggestions,
		total: data?.meta.total ?? 0,
		isLoading,
		isError,
		statusFilter,
		handleStatusChange,
	};
};
