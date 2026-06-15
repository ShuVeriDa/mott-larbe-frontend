import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

import { SectionLabel } from "@/shared/ui/section-label";
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
			"mb-3.5 overflow-hidden rounded-card border-[0.5px] border-bd-1 bg-surf last:mb-0",
			className,
		)}
	>
		{headless ? null : (
			<header className="flex items-center justify-between border-b-[0.5px] border-bd-1 px-4 pt-3 pb-2.5">
				<SectionLabel className="mb-0">
					{title}
				</SectionLabel>
				{rightSlot}
			</header>
		)}
		<div className={cn("p-3.5", bodyClassName)}>{children}</div>
	</section>
);
