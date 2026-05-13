"use client";

import { Typography } from "@/shared/ui/typography";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { LevelDistItem } from "@/entities/admin-analytics";
import type { CefrLevel } from "@/shared/types";
import { CEFR_LEVEL_BADGE_CLASS } from "@/shared/lib/cefr-colors";

const LEVEL_BAR_COLOR: Record<CefrLevel, string> = {
	A: "bg-grn",
	B: "bg-acc",
	C: "bg-amb",
};

interface AnalyticsLevelDistProps {
	items?: LevelDistItem[];
	isLoading?: boolean;
}

export const AnalyticsLevelDist = ({
	items,
	isLoading,
}: AnalyticsLevelDistProps) => {
	const { t } = useI18n();

	return (
		<div className="rounded-card border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between px-4 py-3.5 pb-3">
				<Typography tag="span" className="text-[13px] font-semibold text-t-1">
					{t("admin.analytics.levelDist.title")}
				</Typography>
				<Typography tag="span" className="text-[11px] text-t-3">
					{t("admin.analytics.levelDist.subtitle")}
				</Typography>
			</div>

			<div className="px-4 pb-4">
				{isLoading || !items
					? Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="mb-3 last:mb-0">
								<div className="mb-1 flex items-center justify-between">
									<div className="h-4 w-28 animate-pulse rounded bg-surf-3" />
									<div className="h-3 w-12 animate-pulse rounded bg-surf-3" />
								</div>
								<div className="h-1.5 rounded-full bg-surf-3" />
							</div>
						))
					: items.map((item) => (
							<div key={item.level} className="mb-3 last:mb-0">
								<div className="mb-1 flex items-center justify-between">
									<div className="flex items-center gap-1.5 text-[12px] font-medium text-t-1">
										<Typography tag="span"
											className={cn(
												"inline-flex h-5 items-center justify-center rounded-[5px] px-1.5 text-[10.5px] font-bold tracking-[0.3px]",
												CEFR_LEVEL_BADGE_CLASS[item.level],
											)}
										>
											{t(`shared.cefrLevel.${item.level}`)}
										</Typography>
										{t(`admin.analytics.levelDist.${item.level.toLowerCase()}`)}
									</div>
									<Typography tag="span" className="text-[11px] text-t-3">
										{item.usersCount} · {item.percent}%
									</Typography>
								</div>
								<div className="h-1.5 overflow-hidden rounded-full bg-surf-3">
									<div
										className={cn("h-full rounded-full", LEVEL_BAR_COLOR[item.level])}
										style={{ width: `${item.percent}%` }}
									/>
								</div>
							</div>
						))}
			</div>
		</div>
	);
};
