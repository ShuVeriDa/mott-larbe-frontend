import { cn } from "@/shared/lib/cn";
import type { LearningLevel } from "@/shared/types";

const FILL: Record<LearningLevel, string> = {
	NEW: "bg-t-3",
	LEARNING: "bg-amb",
	KNOWN: "bg-grn",
};

export interface Sm2BarProps {
	percent: number;
	status: LearningLevel;
	className?: string;
}

export const Sm2Bar = ({ percent, status, className }: Sm2BarProps) => {
	const clamped = Math.min(100, Math.max(0, percent));
	return (
		<div
			role="progressbar"
			aria-valuenow={clamped}
			aria-valuemin={0}
			aria-valuemax={100}
			className={cn(
				"h-[3px] w-12 overflow-hidden rounded-[2px] bg-surf-3",
				className,
			)}
		>
			<div
				className={cn("h-full rounded-[2px]", FILL[status])}
				style={{ width: `${clamped}%` }}
			/>
		</div>
	);
};
