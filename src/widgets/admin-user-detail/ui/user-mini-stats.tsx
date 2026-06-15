import type { UserLearningStats } from "@/entities/admin-user";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { AdminStatCard, AdminStatCardSkeleton } from "@/shared/ui/admin-stat-card";

interface UserMiniStatsProps {
	stats: UserLearningStats | undefined;
	isLoading: boolean;
}

export const UserMiniStats = ({ stats, isLoading }: UserMiniStatsProps) => {
	const { t } = useI18n();

	if (isLoading || !stats) {
		return (
			<div className="grid grid-cols-4 gap-2 max-sm:grid-cols-2 max-[900px]:grid-cols-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<AdminStatCardSkeleton key={i} className="rounded-lg p-[11px]" hideSub />
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-4 gap-2 max-sm:grid-cols-2 max-[900px]:grid-cols-2">
			<AdminStatCard
				label={t("admin.userDetail.stats.textsRead")}
				value={stats.textsRead.toLocaleString()}
				sub={t("admin.userDetail.stats.allTime")}
				className="rounded-lg p-[11px]"
			/>
			<AdminStatCard
				label={t("admin.userDetail.stats.dictionaryWords")}
				value={stats.dictionaryWordsCount.toLocaleString()}
				sub={t("admin.userDetail.stats.folders", {
					count: stats.dictionaryFoldersCount,
				})}
				valueClassName="text-pur-t"
				className="rounded-lg p-[11px]"
			/>
			<AdminStatCard
				label={t("admin.userDetail.stats.failLookup")}
				value={stats.failLookupCount.toLocaleString()}
				sub={t("admin.userDetail.events.eventType.FAIL_LOOKUP")}
				valueClassName="text-red"
				className="rounded-lg p-[11px]"
			/>
			<AdminStatCard
				label={t("admin.userDetail.stats.streak")}
				value={stats.streakDays.toLocaleString()}
				sub={t("admin.userDetail.stats.days")}
				valueClassName="text-amb"
				className="rounded-lg p-[11px]"
			/>
		</div>
	);
};
