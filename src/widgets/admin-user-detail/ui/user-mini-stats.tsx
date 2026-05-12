import type { UserLearningStats } from "@/entities/admin-user";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

interface UserMiniStatsProps {
	stats: UserLearningStats | undefined;
	isLoading: boolean;
}

const Skeleton = () => (
	<div className="animate-pulse rounded-lg border border-bd-1 bg-surf p-[11px]">
		<div className="mb-1 h-2.5 w-20 rounded bg-surf-3" />
		<div className="mb-1 h-5 w-10 rounded bg-surf-3" />
		<div className="h-2.5 w-16 rounded bg-surf-3" />
	</div>
);

interface StatCardProps {
	label: string;
	value: number;
	sub: string;
	valueClass?: string;
}

const StatCard = ({ label, value, sub, valueClass }: StatCardProps) => (
	<div className="rounded-lg border border-bd-1 bg-surf p-[11px]">
		<div className="mb-1 text-[10.5px] font-medium text-t-3">{label}</div>
		<div
			className={cn(
				"mb-0.5 text-[19px] font-semibold leading-none text-t-1",
				valueClass,
			)}
		>
			{value.toLocaleString()}
		</div>
		<div className="text-[10.5px] text-t-3">{sub}</div>
	</div>
);

export const UserMiniStats = ({ stats, isLoading }: UserMiniStatsProps) => {
	const { t } = useI18n();

	if (isLoading || !stats) {
		return (
			<div className="grid grid-cols-4 gap-2 max-sm:grid-cols-2 max-[900px]:grid-cols-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-4 gap-2 max-sm:grid-cols-2 max-[900px]:grid-cols-2">
			<StatCard
				label={t("admin.userDetail.stats.textsRead")}
				value={stats.textsRead}
				sub={t("admin.userDetail.stats.allTime")}
			/>
			<StatCard
				label={t("admin.userDetail.stats.dictionaryWords")}
				value={stats.dictionaryWordsCount}
				sub={t("admin.userDetail.stats.folders", {
					count: stats.dictionaryFoldersCount,
				})}
				valueClass="text-pur-t"
			/>
			<StatCard
				label={t("admin.userDetail.stats.failLookup")}
				value={stats.failLookupCount}
				sub={t("admin.userDetail.events.eventType.FAIL_LOOKUP")}
				valueClass="text-red"
			/>
			<StatCard
				label={t("admin.userDetail.stats.streak")}
				value={stats.streakDays}
				sub={t("admin.userDetail.stats.days")}
				valueClass="text-amb"
			/>
		</div>
	);
};
