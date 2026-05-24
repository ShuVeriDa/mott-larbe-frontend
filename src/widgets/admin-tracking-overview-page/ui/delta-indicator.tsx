import { cn } from "@/lib/utils";

interface DeltaIndicatorProps {
	delta: { pct: number; sign: 1 | -1 | 0 } | null;
	inverse?: boolean;
	vsLabel: string;
}

export const DeltaIndicator = ({ delta, inverse = false, vsLabel }: DeltaIndicatorProps) => {
	if (!delta || delta.sign === 0) {
		return <span className="text-xs text-muted-foreground">— {vsLabel}</span>;
	}

	const isGood = inverse ? delta.sign === -1 : delta.sign === 1;
	const arrow = delta.sign === 1 ? "↑" : "↓";

	return (
		<span
			className={cn(
				"text-xs font-medium",
				isGood ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400",
			)}
		>
			{arrow} {delta.pct.toFixed(1)}% {vsLabel}
		</span>
	);
};
