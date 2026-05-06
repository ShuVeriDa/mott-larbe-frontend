import type { FeatureFlagHistoryItem, FeatureFlagHistoryEventType } from "@/entities/feature-flag";
import { cn } from "@/shared/lib/cn";

const formatDate = (iso: string) =>
	new Date(iso).toLocaleString("ru-RU", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});

const EVENT_DOT: Record<FeatureFlagHistoryEventType, string> = {
	GLOBAL_ENABLED: "bg-grn",
	OVERRIDE_ADDED: "bg-grn",
	FLAG_CREATED: "bg-acc",
	FLAG_DUPLICATED: "bg-acc",
	FLAGS_IMPORTED: "bg-acc",
	ENVIRONMENTS_CHANGED: "bg-acc",
	ROLLOUT_CHANGED: "bg-acc",
	FLAG_UPDATED: "bg-acc",
	GLOBAL_DISABLED: "bg-red-400",
	FLAG_DELETED: "bg-red-400",
	OVERRIDE_REMOVED: "bg-red-400",
	OVERRIDE_UPDATED: "bg-amb",
};

interface HistoryTableProps {
	items: FeatureFlagHistoryItem[];
	isLoading: boolean;
	t: (key: string, params?: Record<string, string | number>) => string;
}

const SkeletonRow = () => (
	<tr>
		{Array.from({ length: 4 }).map((_, i) => (
			<td key={i} className="px-3.5 py-3">
				<div className="h-3 animate-pulse rounded bg-surf-3" />
			</td>
		))}
	</tr>
);

export const HistoryTable = ({ items, isLoading, t }: HistoryTableProps) => (
	<div className="overflow-x-auto">
		<table className="w-full min-w-[540px] border-collapse text-[12.5px]">
			<thead>
				<tr>
					<th className="w-5 border-b border-bd-1 pb-2 pl-3.5" />
					<th className="border-b border-bd-1 pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.history.event")}
					</th>
					<th className="w-[180px] border-b border-bd-1 pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.history.flag")}
					</th>
					<th className="w-[140px] border-b border-bd-1 pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.history.actor")}
					</th>
					<th className="w-[120px] border-b border-bd-1 pb-2 pl-3.5 pr-3.5 text-right text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.history.date")}
					</th>
				</tr>
			</thead>
			<tbody>
				{isLoading
					? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
					: items.map((item) => (
							<tr
								key={item.id}
								className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2"
							>
								<td className="pl-3.5">
									<span
										className={cn(
											"block size-[7px] rounded-full",
											EVENT_DOT[item.eventType] ?? "bg-acc",
										)}
									/>
								</td>
								<td className="py-3 pl-3.5 text-t-2">
									{t(`admin.featureFlags.history.eventType.${item.eventType}`)}
								</td>
								<td className="py-3 pl-3.5">
									<span className="rounded-[5px] border border-bd-1 bg-surf-2 px-1.5 py-0.5 font-mono text-[11px] text-t-2">
										{item.flagKey}
									</span>
								</td>
								<td className="py-3 pl-3.5 text-[11.5px]">
									{item.actor ? (
										<span className="text-acc-t font-medium">
											{item.actor.name} {item.actor.surname}
										</span>
									) : (
										<span className="text-t-3">{t("admin.featureFlags.history.system")}</span>
									)}
								</td>
								<td className="py-3 pl-3.5 pr-3.5 text-right text-[11px] text-t-3">
									{formatDate(item.createdAt)}
								</td>
							</tr>
						))}
			</tbody>
		</table>
	</div>
);
