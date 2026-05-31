"use client";

import { ChangeEvent } from "react";
import { AdminListColumn } from "@/shared/ui/admin-list-column";
import type { TextSubmission, TextSubmissionStatus } from "@/features/text-submission";
import { TextSubmissionListItem, TextSubmissionListItemSkeleton } from "./text-submission-list-item";

interface TextSubmissionsLeftColumnProps {
	items: TextSubmission[];
	isLoading: boolean;
	isFetching?: boolean;
	selectedId: string | null;
	search: string;
	statusFilter: TextSubmissionStatus | undefined;
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

export const TextSubmissionsLeftColumn = ({
	items, isLoading, isFetching, selectedId,
	search, statusFilter, order,
	page, pageSize, total,
	onSearchChange, onStatusChange, onOrderChange,
	onPageChange, onPageSizeChange,
	onSelect, t,
}: TextSubmissionsLeftColumnProps) => (
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
		searchPlaceholder={`${t("adminTextSubmissions.fields.title")}, ${t("adminTextSubmissions.fields.author")}…`}
		statusOptions={[
			{ value: "", label: t("adminTextSubmissions.filter.all") },
			{ value: "PENDING", label: t("adminTextSubmissions.filter.pending") },
			{ value: "APPROVED", label: t("adminTextSubmissions.filter.approved") },
			{ value: "REJECTED", label: t("adminTextSubmissions.filter.rejected") },
		]}
		sortOptions={[
			{ value: "desc", label: t("adminTextSubmissions.sortNewest") },
			{ value: "asc", label: t("adminTextSubmissions.sortOldest") },
		]}
		emptyText={t("adminTextSubmissions.empty")}
		emptySearchText={t("adminTextSubmissions.emptySearch")}
		onSearchChange={onSearchChange}
		onStatusChange={onStatusChange}
		onOrderChange={onOrderChange}
		onPageChange={onPageChange}
		onPageSizeChange={onPageSizeChange}
		renderItem={(item) => (
			<TextSubmissionListItem
				key={item.id}
				item={item}
				isActive={item.id === selectedId}
				onSelect={onSelect}
				t={t}
			/>
		)}
		renderSkeleton={(i) => <TextSubmissionListItemSkeleton key={i} />}
	/>
);
