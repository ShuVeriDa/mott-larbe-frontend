"use client";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";

const CELL_COLORS = [
	"bg-surf-3",
	"bg-acc/15",
	"bg-acc/30",
	"bg-acc/50",
	"bg-acc/70",
	"bg-acc/90",
] as const;

interface HeatmapLegendProps {
	t: (k: string) => string;
}

export const HeatmapLegend = ({ t }: HeatmapLegendProps) => (
	<div className="mt-2 flex items-center gap-1" style={{ marginLeft: 32 }}>
		<Typography tag="span" className="mr-0.5 text-[9.5px] text-t-3">{t("statistics.streak.less")}</Typography>
		{CELL_COLORS.map((cls, i) => (
			<div key={i} className={cn("size-[11px] shrink-0 rounded-[2px]", cls)} />
		))}
		<Typography tag="span" className="ml-0.5 text-[9.5px] text-t-3">{t("statistics.streak.more")}</Typography>
	</div>
);
