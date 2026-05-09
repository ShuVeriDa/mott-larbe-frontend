import type { ReactNode } from 'react';
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";

export interface SectionCardProps {
	title?: ReactNode;
	headerExtra?: ReactNode;
	children: ReactNode;
	className?: string;
	bodyClassName?: string;
}

export const SectionCard = ({
	title,
	headerExtra,
	children,
	className,
	bodyClassName,
}: SectionCardProps) => (
	<section
		className={cn(
			"overflow-hidden rounded-card border-hairline border-bd-1 bg-surf transition-colors duration-200",
			className,
		)}
	>
		{title || headerExtra ? (
			<header className="flex flex-wrap items-center justify-between gap-2 border-hairline border-b border-bd-1 px-4 pb-3 pt-3.5 max-md:px-3 max-md:py-2.5">
				{title ? (
					<Typography
						tag="h2"
						className="text-[12.5px] font-semibold text-t-1"
					>
						{title}
					</Typography>
				) : (
					<Typography tag="span" />
				)}
				{headerExtra}
			</header>
		) : null}
		<div className={cn(bodyClassName)}>{children}</div>
	</section>
);
