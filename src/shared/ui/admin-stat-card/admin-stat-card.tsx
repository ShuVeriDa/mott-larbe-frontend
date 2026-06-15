import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

interface AdminStatCardProps {
	label: string;
	value: ReactNode;
	sub?: ReactNode;
	valueClassName?: string;
	className?: string;
}

export const AdminStatCard = ({
	label,
	value,
	sub,
	valueClassName,
	className,
}: AdminStatCardProps) => (
	<div
		className={cn(
			"rounded-card border border-bd-1 bg-surf px-3.5 py-3 transition-colors",
			className,
		)}
	>
		<div className="mb-1.5 text-[10.5px] font-medium tracking-[0.3px] text-t-3">
			{label}
		</div>
		<div
			className={cn(
				"text-[20px] font-semibold leading-none text-t-1",
				valueClassName,
			)}
		>
			{value}
		</div>
		{sub != null && (
			<div className="mt-0.5 text-[10.5px] text-t-3">{sub}</div>
		)}
	</div>
);
