import { ReactNode } from 'react';
import { cn } from "@/shared/lib/cn";
import { SectionLabel } from "@/shared/ui/section-label";

export interface SidebarSectionProps {
	title: string;
	children: ReactNode;
	className?: string;
	action?: ReactNode;
}

export const SidebarSection = ({
	title,
	children,
	className,
	action,
}: SidebarSectionProps) => (
	<div className={className}>
		<div className="mb-2 flex items-center justify-between">
			<SectionLabel className="mb-0">
				{title}
			</SectionLabel>
			{action}
		</div>
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
	<SectionLabel className={cn("mb-2", className)}>
		{children}
	</SectionLabel>
);
