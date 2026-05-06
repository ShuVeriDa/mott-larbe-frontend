"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { TextVersionListItem } from "@/entities/admin-text";

interface StatCardProps {
	label: string;
	sub: string;
	value: number | string;
	valueClass?: string;
	isLoading: boolean;
}

const StatCard = ({ label, sub, value, valueClass, isLoading }: StatCardProps) => (
	<div className="rounded-card border border-bd-1 bg-surf p-3 transition-colors">
		<div className="mb-[5px] text-[10.5px] font-medium uppercase tracking-[0.3px] text-t-3">
			{label}
		</div>
		{isLoading ? (
			<div className="h-7 w-10 animate-pulse rounded bg-surf-3" />
		) : (
			<div className={cn("text-[22px] font-semibold leading-none text-t-1", valueClass)}>
				{value}
			</div>
		)}
		<div className="mt-[3px] text-[10.5px] text-t-3">{sub}</div>
	</div>
);

interface VersionsStatsRowProps {
	total: number;
	successCount: number;
	errorCount: number;
	currentVersion: TextVersionListItem | null;
	isLoading: boolean;
}

export const VersionsStatsRow = ({ total, successCount, errorCount, currentVersion, isLoading }: VersionsStatsRowProps) => {
	const { t } = useI18n();

	return (
		<div className="mb-5 grid grid-cols-4 gap-2.5 max-sm:grid-cols-2 max-sm:gap-2">
			<StatCard
				label={t("admin.texts.versions.stats.total")}
				sub={t("admin.texts.versions.stats.totalSub")}
				value={total}
				isLoading={isLoading}
			/>
			<StatCard
				label={t("admin.texts.versions.stats.completed")}
				sub={t("admin.texts.versions.stats.completedSub")}
				value={successCount}
				valueClass="text-grn"
				isLoading={isLoading}
			/>
			<StatCard
				label={t("admin.texts.versions.stats.errors")}
				sub={t("admin.texts.versions.stats.errorsSub")}
				value={errorCount}
				valueClass={errorCount > 0 ? "text-red" : undefined}
				isLoading={isLoading}
			/>
			<StatCard
				label={t("admin.texts.versions.stats.currentTokens")}
				sub={t("admin.texts.versions.stats.currentTokensSub", {
					pages: String(currentVersion?.pageCount ?? "—"),
				})}
				value={currentVersion ? currentVersion.tokenCount.toLocaleString() : "—"}
				isLoading={isLoading}
			/>
		</div>
	);
};
