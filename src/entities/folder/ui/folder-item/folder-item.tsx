import { ReactNode } from 'react';
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";

export interface FolderItemProps {
	name: string;
	count: number;
	active?: boolean;
	icon?: ReactNode;
	onClick?: () => void;
}

export const FolderItem = ({
	name,
	count,
	active = false,
	icon,
	onClick,
}: FolderItemProps) => (
	<button
		type="button"
		aria-pressed={active}
		onClick={onClick}
		className={cn(
			"flex w-full items-center gap-[7px] rounded-base px-2 py-[6px]",
			"text-left font-[inherit] transition-colors duration-100",
			active
				? "bg-acc-bg [&_.fi-name]:text-acc-t [&_.fi-count]:text-acc [&_.fi-icon]:text-acc"
				: "bg-transparent hover:bg-surf-2",
		)}
	>
		<Typography tag="span" className="fi-icon size-[14px] shrink-0 text-t-3">
			{icon}
		</Typography>
		<Typography
			tag="span"
			className="fi-name flex-1 truncate text-[12.5px] text-t-2"
		>
			{name}
		</Typography>
		<Typography
			tag="span"
			className="fi-count text-[11px] font-medium text-t-3"
		>
			{count}
		</Typography>
	</button>
);
