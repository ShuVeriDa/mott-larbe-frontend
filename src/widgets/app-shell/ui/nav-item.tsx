"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import type { ReactNode } from "react";

interface NavItemProps {
	href: string;
	icon: ReactNode;
	labelKey: string;
	active: boolean;
	isCompactMode?: boolean;
}

export const NavItem = ({ href, icon, labelKey, active, isCompactMode = false }: NavItemProps) => {
	const { t } = useI18n();

	return (
		<Link
			href={href}
			title={t(labelKey)}
			className={cn(
				"relative flex w-full items-center gap-[9px] px-3.5 py-1.5 text-[13px] transition-[color,padding,gap] duration-200",
				isCompactMode && "max-[899px]:justify-center max-[899px]:gap-0 max-[899px]:px-0",
				active ? "bg-acc-bg text-acc-t" : "text-t-2 hover:bg-surf-2 hover:text-t-1",
			)}
		>
			<Typography
				tag="span"
				className={cn("shrink-0", active ? "text-acc-t" : "text-t-3")}
			>
				{icon}
			</Typography>
			<Typography
				tag="span"
				className={cn(
					"transition-[width,opacity] duration-200",
					isCompactMode && "max-[899px]:w-0 max-[899px]:overflow-hidden max-[899px]:opacity-0",
				)}
			>
				{t(labelKey)}
			</Typography>
			{active ? (
				<Typography
					tag="span"
					aria-hidden="true"
					className="absolute left-0 top-[5px] bottom-[5px] w-[2px] rounded-r-[2px] bg-acc"
				/>
			) : null}
		</Link>
	);
};
