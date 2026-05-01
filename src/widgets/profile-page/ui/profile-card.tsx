import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";

export interface ProfileCardProps {
	title: ReactNode;
	headExtra?: ReactNode;
	children: ReactNode;
	className?: string;
	bodyClassName?: string;
	noBody?: boolean;
}

export const ProfileCard = ({
	title,
	headExtra,
	children,
	className,
	bodyClassName,
	noBody,
}: ProfileCardProps) => (
	<section
		className={cn(
			"overflow-hidden rounded-[11px] border-hairline border-bd-1 bg-surf transition-colors",
			className,
		)}
	>
		<header className="flex items-center justify-between gap-2 border-hairline border-b border-bd-1 px-4 pb-2.5 pt-3">
			<Typography tag="h3" className="text-[12.5px] font-semibold text-t-1">
				{title}
			</Typography>
			{headExtra}
		</header>
		{noBody ? (
			children
		) : (
			<div className={cn("flex flex-col gap-3 px-4 py-3.5", bodyClassName)}>
				{children}
			</div>
		)}
	</section>
);
