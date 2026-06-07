import { Typography } from "@/shared/ui/typography";

interface StatChipProps {
	label: string;
	value: number;
	highlight?: boolean;
}

export const StatChip = ({ label, value, highlight }: StatChipProps) => (
	<div className="flex items-center gap-1 rounded-[6px] border border-bd-1 bg-surf px-2 py-[3px]">
		<Typography tag="span" className="text-[10.5px] text-t-3">
			{label}
		</Typography>
		<Typography
			tag="span"
			className={`text-[12px] font-semibold ${highlight ? "text-acc-t" : "text-t-1"}`}
		>
			{value}
		</Typography>
	</div>
);
