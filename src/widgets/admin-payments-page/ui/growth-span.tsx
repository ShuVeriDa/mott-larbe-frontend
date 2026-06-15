import { Typography } from "@/shared/ui/typography";

const fmtGrowth = (val: number | null | undefined): string => {
	if (val == null) return "";
	const sign = val >= 0 ? "+" : "";
	return `${sign}${val.toFixed(1)}%`;
};

export const GrowthSpan = ({ val }: { val: number | null | undefined }) => {
	if (val == null) return null;
	const positive = val >= 0;
	return (
		<Typography tag="span" className={positive ? "text-grn-t" : "text-red-t"}>
			{fmtGrowth(val)}
		</Typography>
	);
};
