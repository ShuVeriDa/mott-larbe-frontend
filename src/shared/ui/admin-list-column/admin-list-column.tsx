"use client";

import { ChangeEvent, ComponentProps, ReactNode } from "react";
import { Inbox } from "lucide-react";
import { SearchBox } from "@/shared/ui/search-box";
import { Select } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import { Pagination } from "@/shared/ui/pagination";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

interface AdminListColumnProps<T> {
	items: T[];
	isLoading: boolean;
	isFetching?: boolean;
	skeletonCount?: number;
	search?: string;
	statusFilter?: string;
	order: "asc" | "desc";
	page: number;
	pageSize: number;
	total: number;
	searchPlaceholder: string;
	statusOptions: { value: string; label: string }[];
	sortOptions: { value: string; label: string }[];
	emptyText: string;
	emptySearchText: string;
	onSearchChange?: (v: string) => void;
	onStatusChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	onOrderChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	renderItem: (item: T) => ReactNode;
	renderSkeleton: (i: number) => ReactNode;
}

export const AdminListColumn = <T extends { id: string }>({
	items, isLoading, isFetching = false, skeletonCount = 8,
	search, statusFilter, order,
	page, pageSize, total,
	searchPlaceholder, statusOptions, sortOptions,
	emptyText, emptySearchText,
	onSearchChange, onStatusChange, onOrderChange,
	onPageChange, onPageSizeChange,
	renderItem, renderSkeleton,
}: AdminListColumnProps<T>) => {
	const isEmpty = !isLoading && items.length === 0;
	const showOverlay = isFetching && !isLoading && items.length > 0;

	const handleSearchChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) =>
		onSearchChange?.(e.currentTarget.value);

	return (
		<div className="flex flex-1 flex-col overflow-hidden border-r border-bd-1">
			{/* Row 1: search + status filter */}
			<div className="flex shrink-0 gap-2 border-b border-bd-1 p-3">
				{onSearchChange && (
					<SearchBox
						variant="toolbar"
						wrapperClassName="flex-1 h-[30px]"
						placeholder={searchPlaceholder}
						value={search ?? ""}
						onChange={handleSearchChange}
					/>
				)}
				<Select
					value={statusFilter ?? ""}
					onChange={onStatusChange}
					wrapperClassName="w-auto shrink-0"
					variant="sm"
				>
					{statusOptions.map((opt) => (
						<option key={opt.value} value={opt.value}>{opt.label}</option>
					))}
				</Select>
			</div>

			{/* List — relative for overlay */}
			<div className="relative flex-1 overflow-y-auto">
				{isLoading
					? Array.from({ length: skeletonCount }).map((_, i) => renderSkeleton(i))
					: isEmpty
						? (
							<div className="flex flex-col items-center px-4 py-12 text-center">
								<Inbox className="mb-3 size-8 text-t-4" />
								<Typography tag="p" className="text-[12.5px] text-t-3">
									{search || statusFilter ? emptySearchText : emptyText}
								</Typography>
							</div>
						)
						: items.map((item) => renderItem(item))}

				{/* Overlay during pagination/filter refetch */}
				{showOverlay && (
					<div className="absolute inset-0 bg-surf/60 backdrop-blur-[1px] transition-opacity" />
				)}
			</div>

			{/* Bottom: sort + pagination in one row */}
			<div className="shrink-0 border-t border-bd-1 px-3 py-2">
				<div className="flex items-center gap-2">
					<Select value={order} onChange={onOrderChange} wrapperClassName="w-auto shrink-0" variant="sm">
						{sortOptions.map((opt) => (
							<option key={opt.value} value={opt.value}>{opt.label}</option>
						))}
					</Select>
					<div className="flex-1">
						<Pagination
							page={page}
							pageSize={pageSize}
							total={total}
							pageSizeOptions={PAGE_SIZE_OPTIONS}
							onPageChange={onPageChange}
							onPageSizeChange={onPageSizeChange}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
