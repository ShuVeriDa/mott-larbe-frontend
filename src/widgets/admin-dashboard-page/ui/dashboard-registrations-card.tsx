"use client";

import { AdminCard } from "@/shared/ui/admin-card";
import type { AdminDashboardChart } from "@/entities/admin-dashboard";
import {
	CHART_AXIS_TICK_STYLE,
	CHART_TOOLTIP_CONTENT_STYLE,
	CHART_TOOLTIP_LABEL_STYLE,
} from "@/shared/lib/chart-config";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const formatLabel = (iso: string) => {
	if (iso.length === 7) {
		const [, m] = iso.split("-");
		const months = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
		return months[parseInt(m, 10) - 1] ?? iso;
	}
	const d = new Date(iso);
	return `${d.getDate()} ${["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"][d.getMonth()]}`;
};

interface DashboardRegistrationsCardProps {
	chart: AdminDashboardChart;
}

export const DashboardRegistrationsCard = ({ chart }: DashboardRegistrationsCardProps) => {
	const { t } = useI18n();
	const params = useParams<{ lang: string }>();

	const data = chart.labels.map((label, i) => ({
		label: formatLabel(label),
		newUsers: chart.newUsers[i],
		activeUsers: chart.activeUsers[i],
	}));

	return (
		<AdminCard>
			<div className="flex items-center justify-between gap-2 px-4 pt-3.5">
				<Typography tag="span" className="text-[13px] font-semibold text-t-1">
					{t("admin.dashboard.registrations.title")}
				</Typography>
				<Link
					href={`/${params.lang}/admin/analytics`}
					className="shrink-0 text-[11.5px] text-acc hover:underline"
				>
					{t("admin.dashboard.registrations.detail")}
				</Link>
			</div>

			<div className="flex items-center gap-4 px-4 pt-2">
				<Typography tag="span" className="flex items-center gap-1.5 text-[11px] text-t-3">
					<Typography tag="span" className="inline-block size-2.5 rounded-sm bg-acc" />
					{t("admin.dashboard.registrations.newUsers")}
				</Typography>
				<Typography tag="span" className="flex items-center gap-1.5 text-[11px] text-t-3">
					<Typography tag="span" className="inline-block size-2.5 rounded-full bg-grn" />
					{t("admin.dashboard.registrations.activeUsers")}
				</Typography>
			</div>

			<div className="px-3 pb-3.5 pt-1">
				<ResponsiveContainer width="100%" height={180}>
					<ComposedChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
						<CartesianGrid vertical={false} stroke="var(--bd-1)" />
						<XAxis
							dataKey="label"
							tick={CHART_AXIS_TICK_STYLE}
							tickLine={false}
							axisLine={false}
							interval="equidistantPreserveStart"
						/>
						<YAxis
							yAxisId="left"
							tick={CHART_AXIS_TICK_STYLE}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							yAxisId="right"
							orientation="right"
							tick={CHART_AXIS_TICK_STYLE}
							tickLine={false}
							axisLine={false}
						/>
						<Tooltip
							contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
							labelStyle={CHART_TOOLTIP_LABEL_STYLE}
							cursor={{ fill: "var(--bd-1)" }}
						/>
						<Bar
							yAxisId="left"
							dataKey="newUsers"
							name={t("admin.dashboard.registrations.newUsers")}
							fill="var(--acc)"
							radius={[4, 4, 0, 0]}
							maxBarSize={20}
						/>
						<Line
							yAxisId="right"
							dataKey="activeUsers"
							name={t("admin.dashboard.registrations.activeUsers")}
							stroke="var(--grn)"
							strokeWidth={1.5}
							dot={{ r: 3, fill: "var(--grn)", strokeWidth: 0 }}
							activeDot={{ r: 5 }}
							type="monotone"
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</AdminCard>
	);
};

export const DashboardRegistrationsCardSkeleton = () => (
	<AdminCard>
		<div className="flex items-center justify-between gap-2 px-4 pt-3.5">
			<div className="h-3.5 w-36 animate-pulse rounded bg-surf-3" />
			<div className="h-3 w-16 animate-pulse rounded bg-surf-3" />
		</div>
		<div className="px-4 pb-4 pt-3">
			<div className="h-[180px] w-full animate-pulse rounded-lg bg-surf-3" />
		</div>
	</AdminCard>
);
