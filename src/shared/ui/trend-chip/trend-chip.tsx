import { cn } from "@/shared/lib/cn";
import { ArrowDown, ArrowUp } from "lucide-react";

export interface TrendChipProps {
	value: number | null;
	label: string;
}

export const TrendChip = ({ value, label }: TrendChipProps) => {
	if (value === null) {
		return <span className="text-[11px] text-t-3">{label}</span>;
	}
	const up = value >= 0;
	const Icon = up ? ArrowUp : ArrowDown;
	return (
		<span className={cn("flex items-center gap-1 text-[11px]", up ? "text-grn-t" : "text-red-t")}>
			<Icon className="size-3 shrink-0" />
			{up ? "+" : ""}
			{value}% {label}
		</span>
	);
};

export interface AbsoluteTrendProps {
	value: number;
	label: string;
}

export const AbsoluteTrend = ({ value, label }: AbsoluteTrendProps) => {
	const up = value >= 0;
	const Icon = up ? ArrowUp : ArrowDown;
	return (
		<span className={cn("flex items-center gap-1 text-[11px]", up ? "text-grn-t" : "text-red-t")}>
			<Icon className="size-3 shrink-0" />
			{up ? "+" : ""}
			{value} {label}
		</span>
	);
};
