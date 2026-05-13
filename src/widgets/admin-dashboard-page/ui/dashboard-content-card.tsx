"use client";

import { Typography } from "@/shared/ui/typography";

import type { AdminDashboardContent } from "@/entities/admin-dashboard";
import { useI18n } from "@/shared/lib/i18n";
import { CEFR_LEVELS, CefrLevel } from "@/shared/types";

const LEVEL_COLORS: Record<string, string> = {
	A: "var(--grn)",
	// A: "var(--acc)",
	B: "var(--pur)",
	// B: "var(--amb)",
	C: "var(--red-token)",
	// C: "var(--ros-t)",
};

const formatNum = (n: number) => {
	if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
	return String(n);
};

interface DashboardContentCardProps {
	content: AdminDashboardContent;
}

export const DashboardContentCard = ({
	content,
}: DashboardContentCardProps) => {
	const { t } = useI18n();

	const totalLevel = content.textsByLevel.reduce((s, l) => s + l.count, 0) || 1;

	const miniStats = [
		{
			label: t("admin.dashboard.content.texts"),
			value: String(content.totalTexts),
			sub: `+${content.newTextsInPeriod} ${t("admin.dashboard.content.thisPeriod")}`,
		},
		{
			label: t("admin.dashboard.content.published"),
			value: String(content.publishedTexts),
			sub: `${content.publishedPercent}% ${t("admin.dashboard.content.ofAll")}`,
		},
		{
			label: t("admin.dashboard.content.words"),
			value: formatNum(content.dictionaryWordsCount),
			sub: t("admin.dashboard.content.chechen"),
		},
		{
			label: t("admin.dashboard.content.readings"),
			value: formatNum(content.readingsInPeriod),
			sub: t("admin.dashboard.content.perPeriod"),
		},
	];

	const levelsSorted = [...content.textsByLevel].sort(
		(a, b) =>
			CEFR_LEVELS.indexOf(a.level as CefrLevel) -
			CEFR_LEVELS.indexOf(b.level as CefrLevel),
	);

	return (
		<div className="overflow-hidden rounded-[12px] border border-bd-1 bg-surf transition-colors">
			<div className="px-4 pt-3.5">
				<Typography tag="span" className="text-[13px] font-semibold text-t-1">
					{t("admin.dashboard.content.title")}
				</Typography>
			</div>
			<div className="px-4 py-3">
				<div className="mb-3 grid grid-cols-2 gap-2.5">
					{miniStats.map(s => (
						<div key={s.label} className="rounded-[9px] bg-surf-2 px-3 py-2.5">
							<div className="mb-1 text-[10.5px] text-t-3">{s.label}</div>
							<div className="text-[18px] font-semibold leading-none text-t-1">
								{s.value}
							</div>
							<div className="mt-0.5 text-[10.5px] text-t-3">{s.sub}</div>
						</div>
					))}
				</div>

				<div className="space-y-1">
					{levelsSorted.map(lvl => {
						const pct = Math.round((lvl.count / totalLevel) * 100);
						const color = LEVEL_COLORS[lvl.level ?? ""] ?? "var(--t-3)";
						return (
							<div key={lvl.level}>
								<div className="flex items-center justify-between gap-2">
									<Typography tag="span" className="text-[11.5px] text-t-2">
										{lvl.level ?? "—"}
									</Typography>
									<Typography
										tag="span"
										className="shrink-0 text-[11px] text-t-3"
									>
										{lvl.count}{" "}
										{t("admin.dashboard.content.texts").toLowerCase()}
									</Typography>
								</div>
								<div className="my-1.5 h-1 overflow-hidden rounded-full bg-surf-3">
									<div
										className="h-full rounded-full transition-all duration-500"
										style={{ width: `${pct}%`, background: color }}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export const DashboardContentCardSkeleton = () => (
	<div className="overflow-hidden rounded-[12px] border border-bd-1 bg-surf">
		<div className="px-4 pt-3.5">
			<div className="h-3.5 w-20 animate-pulse rounded bg-surf-3" />
		</div>
		<div className="px-4 py-3">
			<div className="mb-3 grid grid-cols-2 gap-2.5">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="rounded-[9px] bg-surf-2 px-3 py-2.5">
						<div className="mb-1.5 h-2.5 w-16 animate-pulse rounded bg-surf-3" />
						<div className="h-5 w-12 animate-pulse rounded bg-surf-3" />
					</div>
				))}
			</div>
			<div className="space-y-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="h-4 animate-pulse rounded bg-surf-3" />
				))}
			</div>
		</div>
	</div>
);
