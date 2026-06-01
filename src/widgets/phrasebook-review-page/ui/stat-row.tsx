import { Typography } from "@/shared/ui/typography";

const toneClass: Record<"grn" | "acc" | "amb" | "neu", string> = {
	grn: "text-grn",
	acc: "text-acc",
	amb: "text-amb",
	neu: "text-t-2",
};

interface StatRowProps {
	label: string;
	value: number;
	tone: "grn" | "acc" | "amb" | "neu";
}

export const StatRow = ({ label, value, tone }: StatRowProps) => (
	<div className="flex items-center justify-between gap-2">
		<Typography className="text-[12px] text-t-3">{label}</Typography>
		<Typography className={`text-[13px] font-semibold tabular-nums ${toneClass[tone]}`}>
			{value}
		</Typography>
	</div>
);
