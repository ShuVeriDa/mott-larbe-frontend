import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";

export interface LimitBarProps {
	label: string;
	used: number;
	limit: number;
	tone?: "blue" | "amber";
	unlimitedLabel: string;
}

export const LimitBar = ({
	label,
	used,
	limit,
	tone = "blue",
	unlimitedLabel,
}: LimitBarProps) => {
	const unlimited = limit < 0;
	const pct = unlimited ? 0 : Math.min(100, Math.max(0, (used / limit) * 100));

	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex justify-between text-[12px] text-t-2">
				<Typography tag="span">{label}</Typography>
				<Typography tag="span">
					<strong className="font-semibold text-t-1">{used}</strong>{" "}
					{unlimited ? `/ ${unlimitedLabel}` : `/ ${limit}`}
				</Typography>
			</div>
			<div className="h-[3px] overflow-hidden rounded-[2px] bg-surf-3">
				<div
					className={cn(
						"h-full rounded-[2px] transition-[width] duration-300",
						tone === "amber" ? "bg-amb" : "bg-acc",
					)}
					style={{ width: unlimited ? "100%" : `${pct}%` }}
				/>
			</div>
		</div>
	);
};
