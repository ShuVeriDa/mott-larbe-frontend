"use client";

import { type ComponentProps } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

const LIMIT_OPTIONS = [25, 50, 100] as const;

interface SpellingPaginationProps {
	page: number;
	limit: number;
	total: number;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
}

export const SpellingPagination = ({
	page,
	limit,
	total,
	onPageChange,
	onLimitChange,
}: SpellingPaginationProps) => {
	const { t } = useI18n();
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const from = Math.min((page - 1) * limit + 1, total);
	const to = Math.min(page * limit, total);

	const pages: Array<number | "ellipsis"> = [];
	if (totalPages <= 5) {
		for (let i = 1; i <= totalPages; i++) pages.push(i);
	} else {
		pages.push(1);
		if (page > 3) pages.push("ellipsis");
		const start = Math.max(2, page - 1);
		const end = Math.min(totalPages - 1, page + 1);
		for (let i = start; i <= end; i++) pages.push(i);
		if (page < totalPages - 2) pages.push("ellipsis");
		pages.push(totalPages);
	}

	const btnClass = (active?: boolean) =>
		cn(
			"flex h-7 min-w-[28px] cursor-pointer items-center justify-center rounded-md border border-bd-2 bg-surf px-2 font-sans text-[12px] text-t-2 transition-colors hover:border-acc/20 hover:bg-acc-bg hover:text-acc-t disabled:cursor-default disabled:opacity-40 disabled:hover:border-bd-2 disabled:hover:bg-surf disabled:hover:text-t-2",
			active && "border-acc/20 bg-acc-bg font-semibold text-acc-t",
		);

	const handlePrev: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onPageChange(page - 1);
	const handleNext: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onPageChange(page + 1);
	const handleLimitChange: NonNullable<ComponentProps<"select">["onChange"]> = e =>
		onLimitChange(Number(e.currentTarget.value));

	return (
		<div className="flex flex-wrap items-center justify-between gap-2 border-t border-bd-1 px-3.5 py-2.5">
			<div className="flex items-center gap-2">
				<Typography tag="span" className="text-[12px] text-t-3">
					{t("admin.spellingDictionary.pagination.showing", { from, to, total })}
				</Typography>
				<div className="relative inline-flex">
					<select
						value={limit}
						onChange={handleLimitChange}
						className="h-7 appearance-none cursor-pointer rounded-md border border-bd-2 bg-surf pl-2.5 pr-6 font-sans text-[12px] text-t-2 outline-none transition-colors hover:border-acc/20 hover:bg-acc-bg hover:text-acc-t"
					>
						{LIMIT_OPTIONS.map(opt => (
							<option key={opt} value={opt}>{opt}</option>
						))}
					</select>
					<ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 size-3 -translate-y-1/2 text-t-3" />
				</div>
			</div>

			<div className="flex items-center gap-1">
				<Button disabled={page <= 1} onClick={handlePrev} className={btnClass()}>
					<ChevronLeft className="size-3" />
				</Button>

				{pages.map((p, i) => {
					if (p === "ellipsis") {
						return (
							<Typography tag="span" key={`ellipsis-${i}`} className="px-0.5 text-[12px] text-t-3">
								…
							</Typography>
						);
					}
					const handlePageClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
						onPageChange(p);
					return (
						<Button key={p} onClick={handlePageClick} title={String(p)} className={btnClass(p === page)}>
							{p}
						</Button>
					);
				})}

				<Button disabled={page >= totalPages} onClick={handleNext} className={btnClass()}>
					<ChevronRight className="size-3" />
				</Button>
			</div>
		</div>
	);
};
