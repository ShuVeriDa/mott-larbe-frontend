"use client";

import { ComponentProps } from "react";
import { Pencil, Trash2, Link } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { TextPhraseListItem } from "@/entities/text-phrase";

interface PhraseListItemProps {
	item: TextPhraseListItem;
	isActive: boolean;
	onSelect: (id: string) => void;
	onEdit: (item: TextPhraseListItem) => void;
	onDelete: (item: TextPhraseListItem) => void;
}

export const PhraseListItem = ({
	item,
	isActive,
	onSelect,
	onEdit,
	onDelete,
}: PhraseListItemProps) => {
	const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = () => onSelect(item.id);
	const handleKeyDown: NonNullable<ComponentProps<"div">["onKeyDown"]> = (e) => {
		if (e.key === "Enter" || e.key === " ") onSelect(item.id);
	};
	const handleEdit: NonNullable<ComponentProps<"button">["onClick"]> = (e) => {
		e.stopPropagation();
		onEdit(item);
	};
	const handleDelete: NonNullable<ComponentProps<"button">["onClick"]> = (e) => {
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
					<Typography
						tag="p"
						className="truncate text-[13px] font-semibold text-t-1 leading-snug"
					>
						{item.original}
					</Typography>
					<div className="mt-0.5 flex items-center gap-1.5">
						<Typography tag="span" className="truncate text-[11.5px] text-t-3">
							{item.translation}
						</Typography>
						{item._count.occurrences > 0 && (
							<>
								<span className="text-bd-3">·</span>
								<div className="flex items-center gap-0.5 shrink-0 text-[11px] text-t-4">
									<Link className="size-[9px]" />
									<span>{item._count.occurrences}</span>
								</div>
							</>
						)}
					</div>
				</div>
				<div className="flex shrink-0 items-center gap-1">
					<Badge
						variant="neu"
						className="text-[9.5px] px-[5px] py-px"
					>
						{item.language}
					</Badge>
					<div className="hidden items-center gap-0.5 group-hover:flex">
						<Button
							variant="bare"
							size="bare"
							title="Редактировать"
							onClick={handleEdit}
							className="flex size-[22px] items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
						>
							<Pencil className="size-[11px]" />
						</Button>
						<Button
							variant="bare"
							size="bare"
							title="Удалить"
							onClick={handleDelete}
							className="flex size-[22px] items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
						>
							<Trash2 className="size-[11px]" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export const PhraseListItemSkeleton = () => (
	<div className="border-b border-bd-1 px-3 py-2.5 last:border-b-0">
		<div className="mb-1.5 h-3 w-2/3 animate-pulse rounded bg-surf-3" />
		<div className="h-2.5 w-1/2 animate-pulse rounded bg-surf-3" />
	</div>
);
