"use client";

import { ChangeEvent } from "react";
import { AdminListColumn } from "@/shared/ui/admin-list-column";
import type { Suggestion, SuggestionStatus } from "@/features/suggestions";
import { SuggestionListItem, SuggestionListItemSkeleton } from "./suggestion-list-item";

interface SuggestionsLeftColumnProps {
	items: Suggestion[];
	isLoading: boolean;
	isFetching?: boolean;
	selectedId: string | null;
	search: string;
	statusFilter: SuggestionStatus | undefined;
	order: "asc" | "desc";
	page: number;
	pageSize: number;
	total: number;
	onSearchChange: (v: string) => void;
	onStatusChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	onOrderChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	onSelect: (id: string) => void;
	t: (key: string) => string;
}

export const SuggestionsLeftColumn = ({
	items, isLoading, isFetching, selectedId,
	search, statusFilter, order,
	page, pageSize, total,
	onSearchChange, onStatusChange, onOrderChange,
	onPageChange, onPageSizeChange,
	onSelect, t,
}: SuggestionsLeftColumnProps) => (
	<AdminListColumn
		items={items}
		isLoading={isLoading}
		isFetching={isFetching}
		search={search}
		statusFilter={statusFilter}
		order={order}
		page={page}
		pageSize={pageSize}
		total={total}
		searchPlaceholder={`${t("adminSuggestions.word")}, ${t("adminSuggestions.author")}…`}
		statusOptions={[
			{ value: "", label: t("adminSuggestions.filter.all") },
			{ value: "PENDING", label: t("adminSuggestions.filter.pending") },
			{ value: "APPROVED", label: t("adminSuggestions.filter.approved") },
			{ value: "REJECTED", label: t("adminSuggestions.filter.rejected") },
		]}
		sortOptions={[
			{ value: "desc", label: t("adminSuggestions.sortNewest") },
			{ value: "asc", label: t("adminSuggestions.sortOldest") },
		]}
		emptyText={t("adminSuggestions.empty")}
		emptySearchText={t("adminSuggestions.emptySearch")}
		onSearchChange={onSearchChange}
		onStatusChange={onStatusChange}
		onOrderChange={onOrderChange}
		onPageChange={onPageChange}
		onPageSizeChange={onPageSizeChange}
		renderItem={(item) => (
			<SuggestionListItem
				key={item.id}
				item={item}
				isActive={item.id === selectedId}
				onSelect={onSelect}
				t={t}
			/>
		)}
		renderSkeleton={(i) => <SuggestionListItemSkeleton key={i} />}
	/>
);
