"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";

interface TextsPaginationProps {
	page: number;
	limit: number;
	total: number;
	onPageChange: (page: number) => void;
}

export const TextsPagination = ({ page, limit, total, onPageChange }: TextsPaginationProps) => {
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
			"flex h-7 min-w-[28px] cursor-pointer items-center justify-center rounded-md border border-bd-2 bg-surf px-2 font-sans text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:cursor-default disabled:opacity-40",
			active && "border-acc/20 bg-acc-bg font-semibold text-acc-t",
		);

		const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onPageChange(page - 1);
	const handleClick2: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onPageChange(page + 1);
return (
		<div className="flex flex-wrap items-center justify-between gap-2 border-t border-bd-1 px-3.5 py-2.5">
			<span className="text-[12px] text-t-3">
				{t("admin.texts.pagination.showing", { from, to, total })}
			</span>

			<div className="flex items-center gap-1">
				<button
					type="button"
					disabled={page <= 1}
					onClick={handleClick}
					className={btnClass()}
				>
					<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
						<path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>

				{pages.map((p, i) => {
					if (p === "ellipsis") {
						return <span key={`ellipsis-${i}`} className="px-0.5 text-[12px] text-t-3">…</span>;
					}

					const handlePageClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onPageChange(p);

					return (
						<button
							key={p}
							type="button"
							onClick={handlePageClick}
							className={btnClass(p === page)}
						>
							{p}
						</button>
					);
				})}

				<button
					type="button"
					disabled={page >= totalPages}
					onClick={handleClick2}
					className={btnClass()}
				>
					<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
						<path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>
			</div>
		</div>
	);
};
