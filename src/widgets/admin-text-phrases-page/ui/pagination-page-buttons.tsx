"use client";

import { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";

interface PaginationPageButtonsProps {
	page: number;
	totalPages: number;
	onChange: (page: number) => void;
}

export const PaginationPageButtons = ({
	page,
	totalPages,
	onChange,
}: PaginationPageButtonsProps) => (
	<>
		{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
			const pg =
				totalPages <= 5
					? i + 1
					: page <= 3
						? i + 1
						: page >= totalPages - 2
							? totalPages - 4 + i
							: page - 2 + i;
			const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange(pg);
			return (
				<Button
					key={pg}
					onClick={handleClick}
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
	</>
);
