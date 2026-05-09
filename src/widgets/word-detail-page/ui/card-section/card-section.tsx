import type { ReactNode } from 'react';
import { cn } from "@/shared/lib/cn";

export interface CardSectionProps {
	title: string;
	children: ReactNode;
	rightSlot?: ReactNode;
	headless?: boolean;
	className?: string;
	bodyClassName?: string;
}

export const CardSection = ({
	title,
	children,
	rightSlot,
	headless,
	className,
	bodyClassName,
}: CardSectionProps) => (
	<section
		className={cn(
			"mb-3.5 overflow-hidden rounded-card border-hairline border-bd-1 bg-surf last:mb-0",
			className,
		)}
	>
		{headless ? null : (
			<header className="flex items-center justify-between border-b border-hairline border-bd-1 px-4 pt-3 pb-2.5">
				<span className="text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3">
					{title}
				</span>
				{rightSlot}
			</header>
		)}
		<div className={cn("p-3.5", bodyClassName)}>{children}</div>
	</section>
);
