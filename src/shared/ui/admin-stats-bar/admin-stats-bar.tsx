import { Typography } from "@/shared/ui/typography";

export interface AdminStats {
	total: number;
	pending: number;
	approved: number;
	rejected: number;
}

interface AdminStatsBarProps {
	stats: AdminStats | undefined;
	i18nPrefix: string;
	t: (key: string) => string;
}

const statColors = {
	total: "text-t-1",
	pending: "text-yellow-600 dark:text-yellow-400",
	approved: "text-green-600 dark:text-green-400",
	rejected: "text-red",
} as const;

export const AdminStatsBar = ({ stats, i18nPrefix, t }: AdminStatsBarProps) => {
	if (!stats) return null;

	const items = (["total", "pending", "approved", "rejected"] as const).map((key) => ({
		key,
		value: stats[key],
		color: statColors[key],
	}));

	return (
		<div className="flex shrink-0 items-center gap-5 border-b border-bd-1 bg-surf px-5 py-2.5 max-sm:px-3">
			{items.map(({ key, value, color }) => (
				<div key={key} className="flex items-baseline gap-1.5">
					<Typography tag="span" className={`font-display text-[15px] font-bold ${color}`}>
						{value}
					</Typography>
					<Typography tag="span" className="text-[11px] text-t-3">
						{t(`${i18nPrefix}.stats.${key}`)}
					</Typography>
				</div>
			))}
		</div>
	);
};
