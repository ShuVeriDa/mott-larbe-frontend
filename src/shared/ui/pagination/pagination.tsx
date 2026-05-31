"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface PaginationProps {
	page: number;
	pageSize: number;
	total: number;
	pageSizeOptions?: number[];
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export const Pagination = ({
	page,
	pageSize,
	total,
	pageSizeOptions = [10, 25, 50],
	onPageChange,
	onPageSizeChange,
}: PaginationProps) => {
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
	const to = Math.min(page * pageSize, total);

	const handlePrev = () => onPageChange(page - 1);
	const handleNext = () => onPageChange(page + 1);
	const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onPageSizeChange(Number(e.currentTarget.value));
	};

	const pages = buildPageNumbers(page, totalPages);

	return (
		<div className="flex items-center justify-between gap-2">
			{/* Counter + page size */}
			<div className="flex items-center gap-2 text-[12px] text-t-3">
				<span>{from}–{to} / {total}</span>
				<select
					value={pageSize}
					onChange={handlePageSizeChange}
					className="cursor-pointer rounded-base border-[0.5px] border-bd-2 bg-surf-2 px-1.5 py-[3px] text-[11.5px] text-t-2 outline-none focus:border-acc"
				>
					{pageSizeOptions.map((s) => (
						<option key={s} value={s}>{s} / стр.</option>
					))}
				</select>
			</div>

			{/* Page buttons */}
			{totalPages > 1 && (
				<div className="flex items-center gap-0.5">
					<PageBtn onClick={handlePrev} disabled={page <= 1} aria-label="Предыдущая">
						<ChevronLeft className="size-3.5" />
					</PageBtn>

					{pages.map((p, i) =>
						p === "…" ? (
							<span key={`e${i}`} className="select-none px-0.5 text-[12px] text-t-4">…</span>
						) : (
							<PageBtn
								key={p}
								onClick={() => onPageChange(p as number)}
								active={p === page}
							>
								{p}
							</PageBtn>
						),
					)}

					<PageBtn onClick={handleNext} disabled={page >= totalPages} aria-label="Следующая">
						<ChevronRight className="size-3.5" />
					</PageBtn>
				</div>
			)}
		</div>
	);
};

interface PageBtnProps {
	onClick: () => void;
	disabled?: boolean;
	active?: boolean;
	children: React.ReactNode;
	"aria-label"?: string;
}

const PageBtn = ({ onClick, disabled, active, children, "aria-label": ariaLabel }: PageBtnProps) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		aria-label={ariaLabel}
		aria-current={active ? "page" : undefined}
		className={cn(
			"flex h-[26px] min-w-[26px] items-center justify-center rounded-base px-1.5 text-[12px] font-medium transition-colors",
			"disabled:cursor-not-allowed disabled:opacity-30",
			active
				? "bg-acc text-white"
				: "text-t-2 hover:bg-surf-2 hover:text-t-1",
		)}
	>
		{children}
	</button>
);

const buildPageNumbers = (current: number, total: number): (number | "…")[] => {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
	const result: (number | "…")[] = [1];
	if (current > 3) result.push("…");
	for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
		result.push(p);
	}
	if (current < total - 2) result.push("…");
	result.push(total);
	return result;
};
