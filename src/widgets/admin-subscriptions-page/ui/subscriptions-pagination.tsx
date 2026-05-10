import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface Props {
	page: number;
	limit: number;
	total: number;
	onPageChange: (page: number) => void;
}

export const SubscriptionsPagination = ({
	page,
	limit,
	total,
	onPageChange,
}: Props) => {
	const { t } = useI18n();
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const from = (page - 1) * limit + 1;
	const to = Math.min(page * limit, total);

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
		<div className="flex items-center justify-between border-t border-bd-1 px-3.5 py-2.5">
			<Typography tag="span" className="text-[11.5px] text-t-3">
				{from}–{to} {t("admin.subscriptions.pagination.of")} {total}
			</Typography>
			<div className="flex gap-1">
				<Button
					disabled={page === 1}
					onClick={handleClick}
					className="flex h-[26px] min-w-[26px] items-center justify-center rounded-[6px] border border-bd-1 bg-surf-2 px-1.5 text-[12px] text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1 disabled:pointer-events-none disabled:opacity-40"
				>
					<ChevronLeft className="size-3" />
				</Button>

				{pages.map((p, i) =>
					{
				  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onPageChange(p as number);
				  return p === "…" ? (
						<Typography tag="span"
							key={`ellipsis-${i}`}
							className="flex h-[26px] min-w-[26px] items-center justify-center text-[12px] text-t-4"
						>
							…
						</Typography>
					) : (
						<Button
							key={p}
							onClick={handleClick}
							className={cn(
								"flex h-[26px] min-w-[26px] items-center justify-center rounded-[6px] border px-1.5 text-[12px] transition-colors",
								page === p
									? "border-acc bg-acc font-semibold text-white"
									: "border-bd-1 bg-surf-2 text-t-2 hover:bg-surf-3 hover:text-t-1",
							)}
						>
							{p}
						</Button>
					);
				},
				)}

				<Button
					disabled={page === totalPages}
					onClick={handleClick2}
					className="flex h-[26px] min-w-[26px] items-center justify-center rounded-[6px] border border-bd-1 bg-surf-2 px-1.5 text-[12px] text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1 disabled:pointer-events-none disabled:opacity-40"
				>
					<ChevronRight className="size-3" />
				</Button>
			</div>
		</div>
	);
};
