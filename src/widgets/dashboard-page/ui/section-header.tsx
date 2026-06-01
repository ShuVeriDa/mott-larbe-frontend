"use client";

import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import type { ReactNode } from "react";

interface SectionHeaderProps {
	title: string;
	href?: string;
	linkLabel?: string;
	action?: ReactNode;
}

export const SectionHeader = ({
	title,
	href,
	linkLabel,
	action,
}: SectionHeaderProps) => (
	<div className="flex items-center justify-between gap-3">
		<Typography tag="h2" className="text-[13.5px] font-semibold text-t-1">
			{title}
		</Typography>
		{href && linkLabel && (
			<Link
				href={href}
				className="shrink-0 text-[11.5px] text-acc transition-colors hover:underline"
			>
				{linkLabel}
			</Link>
		)}
		{action}
	</div>
);
