"use client";

import { Typography } from "@/shared/ui/typography";

import { useI18n } from "@/shared/lib/i18n";
import type { TokenizationDistribution } from "@/entities/token";

interface TokenizationDistributionCardProps {
	distribution: TokenizationDistribution | undefined;
}

const DONUT_COLORS = {
	analyzed: "#22c55e",
	ambiguous: "#f59e0b",
	notFound: "#ef4444",
};

const DonutSegment = ({
	value,
	total,
	color,
	offset,
}: {
	value: number;
	total: number;
	color: string;
	offset: number;
}) => {
	const r = 38;
	const circ = 2 * Math.PI * r;
	const pct = total > 0 ? value / total : 0;
	const dashArr = pct * circ;
	const dashOff = circ - offset * circ;
	return (
		<circle
			cx="48"
			cy="48"
			r={r}
			fill="none"
			stroke={color}
			strokeWidth="10"
			strokeDasharray={`${dashArr} ${circ - dashArr}`}
			strokeDashoffset={dashOff}
			strokeLinecap="butt"
			style={{ transform: "rotate(-90deg)", transformOrigin: "48px 48px" }}
		/>
	);
};

export const TokenizationDistributionCard = ({
	distribution,
}: TokenizationDistributionCardProps) => {
	const { t } = useI18n();

	const segments = distribution
		? [
				{
					key: "analyzed" as const,
					value: distribution.analyzed,
					pct: distribution.analyzedPercent,
					color: DONUT_COLORS.analyzed,
					labelKey: "admin.tokenization.tabs.all",
				},
				{
					key: "ambiguous" as const,
					value: distribution.ambiguous,
					pct: distribution.ambiguousPercent,
					color: DONUT_COLORS.ambiguous,
					labelKey: "admin.tokenization.tabs.issues",
				},
				{
					key: "notFound" as const,
					value: distribution.notFound,
					pct: distribution.notFoundPercent,
					color: DONUT_COLORS.notFound,
					labelKey: "admin.tokenization.tabs.notfound",
				},
			]
		: [];

	const total = distribution?.total ?? 0;
	const offsets = segments.reduce<number[]>((acc, seg, i) => {
		if (i === 0) return [0];
		const prev = acc[i - 1] + (distribution ? segments[i - 1].value / total : 0);
		return [...acc, prev];
	}, []);

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
			<div className="flex items-center border-b border-bd-1 px-3.5 py-[11px]">
				<Typography tag="span" className="text-[11px] font-semibold uppercase tracking-[0.4px] text-t-2">
					{t("admin.tokenization.sidePanel.distribution")}
				</Typography>
			</div>

			{!distribution ? (
				<div className="flex justify-center px-3.5 py-4">
					<div className="size-24 animate-pulse rounded-full bg-surf-3" />
				</div>
			) : (
				<>
					<div className="flex justify-center px-3.5 pt-4 pb-2">
						<svg width="96" height="96" viewBox="0 0 96 96">
							<circle cx="48" cy="48" r="38" fill="none" stroke="var(--surf-3)" strokeWidth="10" />
							{segments.map((seg, i) => (
								<DonutSegment
									key={seg.key}
									value={seg.value}
									total={total}
									color={seg.color}
									offset={offsets[i]}
								/>
							))}
							<text x="48" y="44" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--t-1)">
								{total.toLocaleString()}
							</text>
							<text x="48" y="57" textAnchor="middle" fontSize="9" fill="var(--t-3)">
								{t("admin.tokenization.sidePanel.distributionTotal")}
							</text>
						</svg>
					</div>

					<div className="flex flex-col gap-2 px-3.5 pb-3">
						{[
							{
								label: t("admin.tokenization.stats.analyzed"),
								value: distribution.analyzed,
								pct: distribution.analyzedPercent,
								color: DONUT_COLORS.analyzed,
							},
							{
								label: t("admin.tokenization.stats.ambiguous"),
								value: distribution.ambiguous,
								pct: distribution.ambiguousPercent,
								color: DONUT_COLORS.ambiguous,
							},
							{
								label: t("admin.tokenization.stats.notFound"),
								value: distribution.notFound,
								pct: distribution.notFoundPercent,
								color: DONUT_COLORS.notFound,
							},
						].map(({ label, value, pct, color }) => (
							<div key={label} className="flex items-center gap-2.5">
								<Typography tag="span" className="size-2 shrink-0 rounded-full" style={{ background: color }} />
								<Typography tag="span" className="flex-1 text-[12px] text-t-2">{label}</Typography>
								<Typography tag="span" className="text-[11.5px] font-semibold text-t-1">
									{value.toLocaleString()}
								</Typography>
								<Typography tag="span" className="text-[10.5px] text-t-3 w-9 text-right">
									{pct}%
								</Typography>
							</div>
						))}
					</div>

					<div className="border-t border-bd-1 px-3.5 py-2.5">
						<div className="text-[10.5px] font-semibold uppercase tracking-[0.4px] text-t-3 mb-1.5">
							{t("admin.tokenization.sidePanel.sourcesTitle")}
						</div>
						<div className="flex flex-col gap-1">
							{(
								[
									["admin", distribution.sources.admin],
									["cache", distribution.sources.cache],
									["morphology", distribution.sources.morphology],
									["online", distribution.sources.online],
								] as [keyof typeof distribution.sources, number][]
							).map(([key, val]) => (
								<div key={key} className="flex items-center justify-between text-[11.5px]">
									<Typography tag="span" className="text-t-3">
										{t(`admin.tokenization.sidePanel.sources.${key}`)}
									</Typography>
									<Typography tag="span" className="font-medium text-t-2">{val.toLocaleString()}</Typography>
								</div>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
};
