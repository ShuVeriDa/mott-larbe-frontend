"use client";

import type { TextProgressItem } from "@/entities/statistics";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface TextLevelsCardProps {
	items: TextProgressItem[];
}

const LEVEL_ORDER = ["A", "B", "C"];

const LEVEL_COLOR: Record<string, string> = {
	A: "bg-grn",
	B: "bg-acc",
	C: "bg-pur",
};

const LEVEL_TEXT: Record<string, string> = {
	A: "text-grn",
	B: "text-acc",
	C: "text-pur",
};

interface LevelRow {
	level: string;
	total: number;
	completed: number;
	inProgress: number;
	avgProgress: number;
}

const buildRows = (items: TextProgressItem[]): LevelRow[] => {
	const map = new Map<string, { total: number; completed: number; inProgress: number; sumProgress: number }>();

	for (const item of items) {
		const lvl = item.level ?? "—";
		if (!map.has(lvl)) map.set(lvl, { total: 0, completed: 0, inProgress: 0, sumProgress: 0 });
		const bucket = map.get(lvl)!;
		bucket.total++;
		bucket.sumProgress += item.progressPercent;
		if (item.progressPercent >= 100) bucket.completed++;
		else if (item.progressPercent > 0) bucket.inProgress++;
	}

	return LEVEL_ORDER
		.filter((lvl) => map.has(lvl))
		.map((lvl) => {
			const b = map.get(lvl)!;
			return {
				level: lvl,
				total: b.total,
				completed: b.completed,
				inProgress: b.inProgress,
				avgProgress: b.total > 0 ? Math.round(b.sumProgress / b.total) : 0,
			};
		});
};

export const TextLevelsCard = ({ items }: TextLevelsCardProps) => {
	const { t } = useI18n();
	const rows = buildRows(items);

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4 transition-colors">
			<header className="mb-3 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.textLevels.title")}
				</Typography>
				<Typography tag="span" className="text-[11px] text-t-3">
					{t("statistics.textLevels.meta", { count: items.length })}
				</Typography>
			</header>

			{rows.length === 0 ? (
				<div className="py-6 text-center text-[11px] text-t-3">
					{t("statistics.textLevels.empty")}
				</div>
			) : (
				<div className="flex flex-col gap-2.5">
					{rows.map((row) => (
						<div key={row.level}>
							<div className="mb-1 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Typography
										tag="span"
										className={cn("text-[11.5px] font-semibold", LEVEL_TEXT[row.level] ?? "text-t-1")}
									>
										{t(`shared.cefrLevel.${row.level}`)}
									</Typography>
									<Typography tag="span" className="text-[11px] text-t-3">
										{t("statistics.textLevels.texts", { count: row.total })}
									</Typography>
								</div>
								<span className="shrink-0 text-[11px] font-semibold text-t-1">{row.avgProgress}%</span>
							</div>
							<div className="h-1.5 overflow-hidden rounded-full bg-surf-3">
								<div
									className={cn("h-full rounded-full transition-[width]", LEVEL_COLOR[row.level] ?? "bg-acc")}
									style={{ width: `${row.avgProgress}%` }}
								/>
							</div>
						</div>
					))}
				</div>
			)}
		</section>
	);
};
