import { cn } from "@/shared/lib/cn";

export interface SidebarSectionProps {
	title: string;
	children: React.ReactNode;
	className?: string;
}

export const SidebarSection = ({
	title,
	children,
	className,
}: SidebarSectionProps) => (
	<div className={className}>
		<h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3">
			{title}
		</h3>
		{children}
	</div>
);

export interface SidebarSectionTitleProps {
	className?: string;
	children: React.ReactNode;
}

export const SidebarSectionTitle = ({
	className,
	children,
}: SidebarSectionTitleProps) => (
	<h3
		className={cn(
			"mb-2 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3",
			className,
		)}
	>
		{children}
	</h3>
);
