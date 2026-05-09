import { ReactNode } from 'react';
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";

export interface SidebarSectionProps {
	title: string;
	children: ReactNode;
	className?: string;
}

export const SidebarSection = ({
	title,
	children,
	className,
}: SidebarSectionProps) => (
	<div className={className}>
		<Typography
			tag="h3"
			className="mb-2 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3"
		>
			{title}
		</Typography>
		{children}
	</div>
);

export interface SidebarSectionTitleProps {
	className?: string;
	children: ReactNode;
}

export const SidebarSectionTitle = ({
	className,
	children,
}: SidebarSectionTitleProps) => (
	<Typography
		tag="h3"
		className={cn(
			"mb-2 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3",
			className,
		)}
	>
		{children}
	</Typography>
);
