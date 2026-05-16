"use client";

import { ComponentProps } from "react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { SearchBox } from "@/shared/ui/search-box";
import { Typography } from "@/shared/ui/typography";
import type { MorphFormListItem } from "@/features/word-annotation";
import { AnnotationListItem, AnnotationListItemSkeleton } from "./annotation-list-item";

interface AnnotationsLeftColumnProps {
	items: MorphFormListItem[];
	isLoading: boolean;
	selectedId: string;
	search: string;
	page: number;
	totalPages: number;
	total: number;
	limit: number;
	onSearchChange: (v: string) => void;
	onSelectForm: (id: string) => void;
	onDeleteForm: (item: MorphFormListItem) => void;
	onPageChange: (p: number) => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

const btnCls =
	"flex size-6 cursor-pointer items-center justify-center rounded-[5px] border border-bd-2 bg-surf text-[11px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-40";

export const AnnotationsLeftColumn = ({
	items,
	isLoading,
	selectedId,
	search,
	page,
	totalPages,
	total,
	limit,
	onSearchChange,
	onSelectForm,
	onDeleteForm,
	onPageChange,
	t,
}: AnnotationsLeftColumnProps) => {
	const isEmpty = !isLoading && items.length === 0;
	const from = (page - 1) * limit + 1;
	const to = Math.min(page * limit, total);

	const handleSearchChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		onSearchChange(e.currentTarget.value);
	const handlePrev: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onPageChange(page - 1);
	const handleNext: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onPageChange(page + 1);

	return (
		<div className="flex flex-1 flex-col overflow-hidden border-r border-bd-1">
			<div className="flex shrink-0 gap-2 border-b border-bd-1 p-3">
				<SearchBox
					variant="toolbar"
					wrapperClassName="flex-1 h-[30px]"
					placeholder={t("admin.wordAnnotations.searchPlaceholder")}
					value={search}
					onChange={handleSearchChange}
				/>
			</div>

			<div className="flex-1 overflow-y-auto">
				{isLoading
					? Array.from({ length: 8 }).map((_, i) => <AnnotationListItemSkeleton key={i} />)
					: isEmpty
						? (
							<div className="flex flex-col items-center px-4 py-12 text-center">
								<BookOpen className="mb-3 size-8 text-t-4" />
								<Typography tag="p" className="text-[12.5px] text-t-3">
									{search
										? t("admin.wordAnnotations.emptySearch")
										: t("admin.wordAnnotations.empty")}
								</Typography>
							</div>
						)
						: items.map(item => (
							<AnnotationListItem
								key={item.id}
								item={item}
								isActive={item.id === selectedId}
								onSelect={onSelectForm}
								onDelete={onDeleteForm}
							/>
						))}
			</div>

			{total > 0 && (
				<div className="flex shrink-0 items-center justify-between border-t border-bd-1 px-3 py-2.5">
					<Typography tag="span" className="text-[11px] text-t-3">
						{t("admin.wordAnnotations.pagination.showing", { from, to, total })}
					</Typography>
					<div className="flex items-center gap-1">
						<Button size="bare" className={btnCls} onClick={handlePrev} disabled={page <= 1}>
							<ChevronLeft className="size-2.5" />
						</Button>
						{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
							const pg =
								totalPages <= 5
									? i + 1
									: page <= 3
										? i + 1
										: page >= totalPages - 2
											? totalPages - 4 + i
											: page - 2 + i;
							const handlePageClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
								onPageChange(pg);
							return (
								<Button
									key={pg}
									onClick={handlePageClick}
									className={cn(
										"flex size-6 cursor-pointer items-center justify-center rounded-[5px] border text-[11px] transition-colors",
										pg === page
											? "border-acc bg-acc text-white"
											: "border-bd-2 bg-surf text-t-2 hover:border-bd-3 hover:text-t-1",
									)}
								>
									{pg}
								</Button>
							);
						})}
						<Button size="bare" className={btnCls} onClick={handleNext} disabled={page >= totalPages}>
							<ChevronRight className="size-2.5" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};
