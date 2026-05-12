"use client";

import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import type { ReactNode } from "react";

interface NavItemProps {
	href: string;
	label: string;
	icon: ReactNode;
	badge?: number;
	active?: boolean;
	isCompactMode?: boolean;
}

export const NavItem = ({
	href,
	label,
	icon,
	badge,
	active,
	isCompactMode = false,
}: NavItemProps) => (
	<Link
		href={href}
		className={cn(
			"relative flex w-full items-center gap-2.5 px-3.5 py-[7px] text-[13px] transition-[color,padding,gap] duration-200",
			isCompactMode && "max-[899px]:justify-center max-[899px]:gap-0 max-[899px]:px-0",
			active
				? "text-acc-t bg-acc-bg font-medium before:absolute before:bottom-[5px] before:left-0 before:top-[5px] before:w-0.5 before:rounded-r-sm before:bg-acc"
				: "text-t-2 hover:bg-surf-2 hover:text-t-1",
		)}
		title={label}
	>
		<Typography
			tag="span"
			className={cn("size-[15px] shrink-0", active ? "text-acc-t" : "text-t-3")}
		>
			{icon}
		</Typography>
		<Typography
			tag="span"
			className={cn(
				"truncate transition-[width,opacity] duration-200",
				isCompactMode &&
					"max-[899px]:w-0 max-[899px]:overflow-hidden max-[899px]:opacity-0",
			)}
		>
			{label}
		</Typography>
		{badge !== undefined && badge > 0 && (
			<Typography
				tag="span"
				className={cn(
					"ml-auto min-w-[18px] rounded bg-red-bg px-1 py-px text-center text-[10px] font-semibold text-red-t",
					isCompactMode && "max-[899px]:hidden",
				)}
			>
				{badge}
			</Typography>
		)}
	</Link>
);
