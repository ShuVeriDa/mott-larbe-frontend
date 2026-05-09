import { ComponentProps } from 'react';
import { cn } from "@/shared/lib/cn";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
interface Props {
	page: number;
	limit: number;
	total: number;
	onPageChange: (page: number) => void;
}

export const CouponsPagination = ({ page, limit, total, onPageChange }: Props) => {
	const totalPages = Math.ceil(total / limit);
	const from = (page - 1) * limit + 1;
	const to = Math.min(page * limit, total);

	const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
		if (totalPages <= 7) return i + 1;
		if (page <= 4) return i + 1;
		if (page >= totalPages - 3) return totalPages - 6 + i;
		return page - 3 + i;
	});

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onPageChange(page - 1);
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => onPageChange(page + 1);
return (
		<div className="flex items-center justify-between border-t border-bd-1 px-3.5 py-2.5">
			<Typography tag="span" className="text-[11.5px] text-t-3">
				{from}–{to} из {total}
			</Typography>
			<div className="flex gap-0.5">
				<Button
					disabled={page === 1}
					onClick={handleClick}
					className="flex h-[26px] min-w-[26px] items-center justify-center rounded-[6px] border border-bd-1 bg-surf-2 px-1.5 text-[12px] text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1 disabled:pointer-events-none disabled:opacity-40"
				>
					‹
				</Button>
				{pages.map((p) => {
				  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onPageChange(p);
				  return (
					<Button
						key={p}
						onClick={handleClick}
						className={cn(
							"flex h-[26px] min-w-[26px] items-center justify-center rounded-[6px] border px-1.5 text-[12px] transition-colors",
							p === page
								? "border-acc bg-acc font-semibold text-white"
								: "border-bd-1 bg-surf-2 text-t-2 hover:bg-surf-3 hover:text-t-1",
						)}
					>
						{p}
					</Button>
				);
				})}
				<Button
					disabled={page === totalPages}
					onClick={handleClick2}
					className="flex h-[26px] min-w-[26px] items-center justify-center rounded-[6px] border border-bd-1 bg-surf-2 px-1.5 text-[12px] text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1 disabled:pointer-events-none disabled:opacity-40"
				>
					›
				</Button>
			</div>
		</div>
	);
};
