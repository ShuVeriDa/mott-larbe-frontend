import { cn } from "@/shared/lib/cn";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { computeDelta } from "../lib/format";

interface MetricCardProps {
	label: string;
	value: string;
	delta: ReturnType<typeof computeDelta>;
	vsLabel: string;
	inverse?: boolean;
	loading?: boolean;
}

export const MetricCard = ({
	label,
	value,
	delta,
	vsLabel,
	inverse = false,
	loading = false,
}: MetricCardProps) => {
	const sign = delta?.sign ?? 0;
	const isPositive = sign !== 0 && (inverse ? sign === -1 : sign === 1);
	const isNegative = sign !== 0 && (inverse ? sign === 1 : sign === -1);

	return (
		<div className="rounded-card border border-bd-1 bg-surf p-3.5 transition-colors">
			<div className="mb-1.5 truncate text-[11px] font-medium tracking-[0.3px] text-t-3">
				{loading ? (
					<span className="inline-block h-2.5 w-20 animate-pulse rounded bg-surf-3" />
				) : (
					label
				)}
			</div>
			<div className={cn("mb-1 text-[22px] font-semibold leading-none text-t-1", loading && "animate-pulse text-t-4")}>
				{loading ? "—" : value}
			</div>
			{!loading && delta !== null && (
				<div className={cn(
					"flex items-center gap-1 text-[11px]",
					isPositive && "text-grn-t",
					isNegative && "text-red-t",
					!isPositive && !isNegative && "text-t-3",
				)}>
					{isPositive && <ArrowUp className="size-[11px]" aria-hidden="true" />}
					{isNegative && <ArrowDown className="size-[11px]" aria-hidden="true" />}
					{sign === 1 ? "+" : ""}{delta.pct.toFixed(1)}% {vsLabel}
				</div>
			)}
		</div>
	);
};
