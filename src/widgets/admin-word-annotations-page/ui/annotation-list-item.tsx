"use client";

import { ComponentProps } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { MorphFormListItem } from "@/features/word-annotation";

interface AnnotationListItemProps {
	item: MorphFormListItem;
	isActive: boolean;
	onSelect: (id: string) => void;
	onDelete: (item: MorphFormListItem) => void;
}

export const AnnotationListItem = ({
	item,
	isActive,
	onSelect,
	onDelete,
}: AnnotationListItemProps) => {
	const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = () => onSelect(item.id);
	const handleKeyDown: NonNullable<ComponentProps<"div">["onKeyDown"]> = e => {
		if (e.key === "Enter" || e.key === " ") onSelect(item.id);
	};
	const handleDelete: NonNullable<ComponentProps<"button">["onClick"]> = e => {
		e.stopPropagation();
		onDelete(item);
	};

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			className={cn(
				"group relative w-full cursor-pointer border-b border-bd-1 px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-surf-2",
				isActive && "border-l-2 border-l-acc bg-acc-bg/40 hover:bg-acc-bg/60",
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0 flex-1">
					<Typography tag="p" className="truncate text-[13px] font-semibold text-t-1 leading-snug">
						{item.normalized}
					</Typography>
					<div className="mt-0.5 flex items-center gap-1.5">
						<Typography tag="span" className="truncate text-[11.5px] text-t-3">
							→ {item.lemma.baseForm}
						</Typography>
						{item.translation && (
							<>
								<span className="text-bd-3">·</span>
								<Typography tag="span" className="truncate text-[11px] text-t-4">
									{item.translation}
								</Typography>
							</>
						)}
					</div>
				</div>
				<div className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
					<Button
						variant="bare"
						size="bare"
						onClick={handleDelete}
						className="flex size-[22px] items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
					>
						<Trash2 className="size-[11px]" />
					</Button>
				</div>
			</div>
		</div>
	);
};

export const AnnotationListItemSkeleton = () => (
	<div className="border-b border-bd-1 px-3 py-2.5 last:border-b-0">
		<div className="mb-1.5 h-3 w-2/3 animate-pulse rounded bg-surf-3" />
		<div className="h-2.5 w-1/2 animate-pulse rounded bg-surf-3" />
	</div>
);
