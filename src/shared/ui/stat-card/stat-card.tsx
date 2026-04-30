import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

export type StatCardProps = ComponentProps<"div">;

export const StatCard = ({ className, ...props }: StatCardProps) => (
	<div
		data-slot="stat-card"
		className={cn(
			"bg-surf border-hairline border-bd-1 rounded-card px-[14px] py-3",
			"transition-colors duration-200",
			className,
		)}
		{...props}
	/>
);

export type StatLabelProps = ComponentProps<"div">;

export const StatLabel = ({ className, ...props }: StatLabelProps) => (
	<div
		data-slot="stat-label"
		className={cn(
			"mb-[5px] text-[10.5px] font-medium tracking-[0.3px] text-t-3",
			className,
		)}
		{...props}
	/>
);

export type StatValueProps = ComponentProps<"div">;

export const StatValue = ({ className, ...props }: StatValueProps) => (
	<div
		data-slot="stat-value"
		className={cn(
			"text-[20px] font-semibold leading-none text-t-1",
			className,
		)}
		{...props}
	/>
);

export type StatSubProps = ComponentProps<"div">;

export const StatSub = ({ className, ...props }: StatSubProps) => (
	<div
		data-slot="stat-sub"
		className={cn("mt-[3px] text-[10.5px] text-t-3", className)}
		{...props}
	/>
);
