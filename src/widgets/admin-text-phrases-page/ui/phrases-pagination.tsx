"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentProps } from "react";
import { PaginationPageButtons } from "./pagination-page-buttons";

interface PhrasesPaginationProps {
	page: number;
	totalPages: number;
	total: number;
	limit: number;
	onChange: (page: number) => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const PhrasesPagination = ({
	page,
	totalPages,
	total,
	limit,
	onChange,
	t,
}: PhrasesPaginationProps) => {
	const from = (page - 1) * limit + 1;
	const to = Math.min(page * limit, total);

	const btnCls =
		"flex size-6 cursor-pointer items-center justify-center rounded-[5px] border border-bd-2 bg-surf text-[11px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-40";

	const handlePrev: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onChange(page - 1);
	const handleNext: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onChange(page + 1);

	return (
		<div className="flex shrink-0 items-center justify-between border-t border-bd-1 px-3 py-2.5">
			<Typography tag="span" className="text-[11px] text-t-3">
				{t("admin.textPhrases.pagination.showing", { from, to, total })}
			</Typography>
			<div className="flex items-center gap-1">
				<Button
					size={"bare"}
					className={btnCls}
					onClick={handlePrev}
					disabled={page <= 1}
				>
					<ChevronLeft className="size-2.5" />
				</Button>
				<PaginationPageButtons
					page={page}
					totalPages={totalPages}
					onChange={onChange}
				/>
				<Button
					size="bare"
					className={btnCls}
					onClick={handleNext}
					disabled={page >= totalPages}
				>
					<ChevronRight className="size-2.5" />
				</Button>
			</div>
		</div>
	);
};
