"use client";

import { cn } from "@/shared/lib/cn";

export interface MiniCardProps {
	label: string;
	value: string;
	sub?: string;
	valueClassName?: string;
	isLoading?: boolean;
}

export const MiniCard = ({ label, value, sub, valueClassName, isLoading }: MiniCardProps) => (
	<div className="rounded-[9px] bg-surf-2 p-3">
		<div className="mb-1 text-[10.5px] text-t-3">{label}</div>
		<div
			className={cn(
				"text-[18px] font-semibold leading-none text-t-1",
				valueClassName,
				isLoading && "animate-pulse text-t-4",
			)}
		>
			{isLoading ? "—" : value}
		</div>
		{sub && <div className="mt-0.5 text-[10.5px] text-t-3">{sub}</div>}
	</div>
);
