"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps, ReactNode } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";

interface LogsPaginationProps {
	page: number;
	totalPages: number;
	total: number;
	limit: number;
	onChange: (page: number) => void;
}

export const LogsPagination = ({
	page,
	totalPages,
	total,
	limit,
	onChange,
}: LogsPaginationProps) => {
	const { t } = useI18n();

	const from = Math.min((page - 1) * limit + 1, total);
	const to = Math.min(page * limit, total);

	const pages = buildPages(page, totalPages);

		const handleClick: NonNullable<ComponentProps<typeof PgBtn>["onClick"]> = () => onChange(page - 1);
	const handleClick2: NonNullable<ComponentProps<typeof PgBtn>["onClick"]> = () => onChange(page + 1);
return (
		<div className="flex flex-wrap items-center justify-between gap-2 border-t border-bd-1 px-3.5 py-2.5">
			<Typography tag="span" className="text-[12px] text-t-3">
				{t("admin.logs.pagination.showing", { from, to, total })}
			</Typography>
			<div className="flex items-center gap-1">
				<PgBtn
					disabled={page <= 1}
					onClick={handleClick}
					aria-label={t("admin.logs.pagination.prev")}
				>
					<svg width="11" height="11" viewBox="0 0 16 16" fill="none">
						<path
							d="M10 12L6 8l4-4"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</PgBtn>

				{pages.map((p, i) =>
					{
				  const handleClick: NonNullable<ComponentProps<typeof PgBtn>["onClick"]> = () => onChange(p as number);
				  return p === "…" ? (
						<Typography tag="span"
							key={`ellipsis-${i}`}
							className="px-0.5 text-[12px] text-t-3"
						>
							…
						</Typography>
					) : (
						<PgBtn
							key={p}
							active={p === page}
							onClick={handleClick}
						>
							{p}
						</PgBtn>
					);
				},
				)}

				<PgBtn
					disabled={page >= totalPages}
					onClick={handleClick2}
					aria-label={t("admin.logs.pagination.next")}
				>
					<svg width="11" height="11" viewBox="0 0 16 16" fill="none">
						<path
							d="M6 12l4-4-4-4"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</PgBtn>
			</div>
		</div>
	);
};

const PgBtn = ({
	children,
	active,
	disabled,
	onClick,
	"aria-label": ariaLabel,
}: {
	children: ReactNode;
	active?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	"aria-label"?: string;
}) => (
	<Button
		disabled={disabled}
		onClick={onClick}
		aria-label={ariaLabel}
		className={cn(
			"flex h-7 min-w-[28px] items-center justify-center gap-1 rounded-[6px] border border-bd-2 bg-surf px-2 text-[12px] text-t-2 transition-colors",
			active && "border-acc/20 bg-acc-bg font-semibold text-acc-t",
			!active && !disabled && "hover:bg-surf-2 hover:text-t-1",
			disabled && "cursor-default opacity-40",
		)}
	>
		{children}
	</Button>
);

const buildPages = (page: number, total: number): Array<number | "…"> => {
	if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
	const pages: Array<number | "…"> = [];
	pages.push(1);
	if (page > 3) pages.push("…");
	for (let p = Math.max(2, page - 1); p <= Math.min(total - 1, page + 1); p++) {
		pages.push(p);
	}
	if (page < total - 2) pages.push("…");
	pages.push(total);
	return pages;
};
