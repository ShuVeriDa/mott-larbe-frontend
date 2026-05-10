"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TokenizationPaginationProps {
	page: number;
	total: number;
	limit: number;
	onPageChange: (page: number) => void;
}

export const TokenizationPagination = ({
	page,
	total,
	limit,
	onPageChange,
}: TokenizationPaginationProps) => {
	const { t } = useI18n();

	const totalPages = Math.ceil(total / limit);
	const from = (page - 1) * limit + 1;
	const to = Math.min(page * limit, total);

	if (totalPages <= 1) return null;

	const pages: (number | "…")[] = [];
	if (totalPages <= 7) {
		for (let i = 1; i <= totalPages; i++) pages.push(i);
	} else {
		pages.push(1);
		if (page > 3) pages.push("…");
		for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
			pages.push(i);
		}
		if (page < totalPages - 2) pages.push("…");
		pages.push(totalPages);
	}

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onPageChange(page - 1);
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => onPageChange(page + 1);
return (
		<div className="flex items-center justify-between border-t border-bd-1 px-4 py-3">
			<Typography tag="span" className="text-[12px] text-t-3 max-sm:hidden">
				{t("admin.tokenization.pagination.showing")
					.replace("{from}", String(from))
					.replace("{to}", String(to))
					.replace("{total}", String(total))}
			</Typography>
			<div className="flex gap-1">
				<Button
					onClick={handleClick}
					disabled={page === 1}
					className="flex size-7 items-center justify-center rounded-[6px] border border-bd-2 bg-surf text-t-2 transition-colors hover:bg-surf-2 disabled:cursor-default disabled:opacity-35"
				>
					<ChevronLeft className="size-3" />
				</Button>
				{pages.map((p, i) => {
					if (p === "…") {
						return (
							<Typography tag="span" key={`ellipsis-${i}`} className="flex size-7 items-center justify-center text-[12px] text-t-3">
								…
							</Typography>
						);
					}

					const handlePageClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onPageChange(p);

					return (
						<Button
							key={p}
							onClick={handlePageClick}
							className={`flex size-7 items-center justify-center rounded-[6px] border text-[12px] font-medium transition-colors ${
								p === page
									? "border-acc bg-acc text-white"
									: "border-bd-2 bg-surf text-t-2 hover:bg-surf-2"
							}`}
						>
							{p}
						</Button>
					);
				})}
				<Button
					onClick={handleClick2}
					disabled={page === totalPages}
					className="flex size-7 items-center justify-center rounded-[6px] border border-bd-2 bg-surf text-t-2 transition-colors hover:bg-surf-2 disabled:cursor-default disabled:opacity-35"
				>
					<ChevronRight className="size-3" />
				</Button>
			</div>
		</div>
	);
};
