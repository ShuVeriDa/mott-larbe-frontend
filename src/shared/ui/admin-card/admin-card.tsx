import { cn } from "@/shared/lib/cn";
import type { ComponentProps } from "react";

export type AdminCardProps = ComponentProps<"div">;

export const AdminCard = ({ className, ...props }: AdminCardProps) => (
	<div
		className={cn(
			"overflow-hidden rounded-card border border-bd-1 bg-surf transition-colors",
			className,
		)}
		{...props}
	/>
);

export interface AdminCardHeaderProps {
	title: string;
	subtitle?: string;
	action?: React.ReactNode;
	className?: string;
}

export const AdminCardHeader = ({ title, subtitle, action, className }: AdminCardHeaderProps) => (
	<div className={cn("flex items-center justify-between gap-2 px-4 pt-3.5 pb-3", className)}>
		<div className="flex min-w-0 items-baseline gap-2">
			<span className="text-[13px] font-semibold text-t-1">{title}</span>
			{subtitle && (
				<span className="text-[11px] text-t-3">{subtitle}</span>
			)}
		</div>
		{action}
	</div>
);
