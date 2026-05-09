"use client";
import { type ReactNode } from 'react';
import type { StatsDelta, StatsHeader } from "@/entities/statistics";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface KpiGridProps {
	header: StatsHeader;
}

interface KpiCardProps {
	label: string;
	value: string;
	delta: StatsDelta;
	tone: "acc" | "grn" | "amb" | "pur";
	icon: ReactNode;
}

const TONE_BG: Record<KpiCardProps["tone"], string> = {
	acc: "bg-acc-bg text-acc",
	grn: "bg-grn-bg text-grn",
	amb: "bg-amb-bg text-amb",
	pur: "bg-pur-bg text-pur",
};

const KpiCard = ({ label, value, delta, tone, icon }: KpiCardProps) => {
	const { t } = useI18n();

	const trendKey =
		delta.delta === null || delta.delta === 0
			? "statistics.kpi.deltaZero"
			: delta.delta > 0
				? "statistics.kpi.deltaPositive"
				: "statistics.kpi.deltaNegative";

	const trendValue =
		delta.delta === null
			? null
			: delta.delta === 0
				? t(trendKey)
				: t(trendKey, { n: Math.abs(delta.delta) });

	const trendColor =
		delta.delta === null || delta.delta === 0
			? "text-t-3"
			: delta.delta > 0
				? "text-grn"
				: "text-red";

	return (
		<div className="rounded-card border-hairline border-bd-1 bg-surf p-3.5 transition-colors hover:border-bd-2 hover:shadow-sm">
			<div
				className={cn(
					"mb-2.5 flex size-7 items-center justify-center rounded-base",
					TONE_BG[tone],
				)}
				aria-hidden="true"
			>
				{icon}
			</div>
			<Typography
				tag="p"
				className="mb-1 font-display text-2xl leading-none tracking-[-0.3px] text-t-1"
			>
				{value}
			</Typography>
			<Typography tag="p" className="text-[11px] leading-snug text-t-3">
				{label}
			</Typography>
			{trendValue ? (
				<Typography
					tag="p"
					className={cn(
						"mt-1.5 flex items-center gap-[3px] text-[11px] font-medium",
						trendColor,
					)}
				>
					{delta.delta && delta.delta > 0 ? (
						<svg
							viewBox="0 0 10 10"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							className="size-2.5"
							aria-hidden="true"
						>
							<path d="M2 7l3-4 3 4" />
						</svg>
					) : delta.delta && delta.delta < 0 ? (
						<svg
							viewBox="0 0 10 10"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							className="size-2.5"
							aria-hidden="true"
						>
							<path d="M2 3l3 4 3-4" />
						</svg>
					) : null}
					{trendValue}
				</Typography>
			) : null}
		</div>
	);
};

const formatReadingTime = (
	minutes: number,
	hoursLabel: (n: number) => string,
	minutesLabel: (n: number) => string,
): string => {
	if (minutes < 60) return minutesLabel(minutes);
	const h = Math.floor(minutes / 60);
	return hoursLabel(h);
};

export const KpiGrid = ({ header }: KpiGridProps) => {
	const { t } = useI18n();

	const items: KpiCardProps[] = [
		{
			label: t("statistics.kpi.words"),
			value: header.wordsLearned.total.toLocaleString(),
			delta: header.wordsLearned,
			tone: "acc",
			icon: (
				<svg
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					className="size-[13px]"
				>
					<path d="M3 5h10M3 8h7M3 11h5" strokeLinecap="round" />
				</svg>
			),
		},
		{
			label: t("statistics.kpi.reading"),
			value: formatReadingTime(
				header.readingTimeMinutes.total,
				(n) => t("statistics.kpi.hoursShort", { n }),
				(n) => t("statistics.kpi.minutesShort", { n }),
			),
			delta: header.readingTimeMinutes,
			tone: "grn",
			icon: (
				<svg
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					className="size-[13px]"
				>
					<circle cx="8" cy="8" r="5.5" />
					<path d="M8 5v3.5l2 2" strokeLinecap="round" />
				</svg>
			),
		},
		{
			label: t("statistics.kpi.reviews"),
			value: header.reviews.total.toLocaleString(),
			delta: header.reviews,
			tone: "amb",
			icon: (
				<svg
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					className="size-[13px]"
				>
					<path d="M8 3v5l3 2" strokeLinecap="round" />
					<path d="M3.5 5.5A5.5 5.5 0 1 1 3 9" strokeLinecap="round" />
				</svg>
			),
		},
		{
			label: t("statistics.kpi.texts"),
			value: header.textsRead.total.toLocaleString(),
			delta: header.textsRead,
			tone: "pur",
			icon: (
				<svg
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					className="size-[13px]"
				>
					<path d="M2 3h5v10H2z" />
					<path d="M9 3h5v10H9z" />
				</svg>
			),
		},
	];

	return (
		<section
			aria-label={t("statistics.pageTitle")}
			className="grid grid-cols-4 gap-2 max-md:grid-cols-2"
		>
			{items.map((item) => (
				<KpiCard key={item.label} {...item} />
			))}
		</section>
	);
};
