import { cn } from "@/shared/lib/cn";
import type { ResetStep } from "@/features/reset-password";

interface ResetStepIndicatorProps {
	step: ResetStep;
}

const PROGRESS_BY_STEP: Record<ResetStep, number> = {
	1: 1,
	2: 1,
	3: 2,
	4: 3,
};

export const ResetStepIndicator = ({ step }: ResetStepIndicatorProps) => {
	const progress = PROGRESS_BY_STEP[step];

	return (
		<div className="mb-[22px] flex items-center gap-1.5" aria-hidden="true">
			{[1, 2, 3].map((index) => {
				const done = index < progress;
				const active = index === progress;
				return (
					<div
						key={index}
						className={cn(
							"h-1 w-[22px] rounded-[2px] transition-colors duration-300",
							done && "bg-grn",
							active && "bg-acc",
							!done && !active && "bg-surf-3",
						)}
					/>
				);
			})}
		</div>
	);
};
