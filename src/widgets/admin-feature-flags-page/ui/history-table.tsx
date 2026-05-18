import type { FeatureFlagHistoryItem, FeatureFlagHistoryEventType } from "@/entities/feature-flag";
import { cn } from "@/shared/lib/cn";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
import { Typography } from "@/shared/ui/typography";
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
	<TableRow>
		{Array.from({ length: 4 }).map((_, i) => (
			<TableCell key={i} className="px-3.5 py-3">
				<div className="h-3 animate-pulse rounded bg-surf-3" />
			</TableCell>
		))}
	</TableRow>
);

export const HistoryTable = ({ items, isLoading, t }: HistoryTableProps) => (
	<div className="overflow-x-auto">
		<Table className="min-w-[540px] border-collapse text-[12.5px]" aria-label={t("admin.featureFlags.history.event")}>
			<TableHeader>
				<TableRow>
					<TableHead className="w-5 border-b border-bd-1 pb-2 pl-3.5" />
					<TableHead className="border-b border-bd-1 pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.history.event")}
					</TableHead>
					<TableHead className="w-[180px] border-b border-bd-1 pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.history.flag")}
					</TableHead>
					<TableHead className="w-[140px] border-b border-bd-1 pb-2 pl-3.5 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.history.actor")}
					</TableHead>
					<TableHead className="w-[120px] border-b border-bd-1 pb-2 pl-3.5 pr-3.5 text-right text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.history.date")}
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{isLoading
					? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
					: items.map((item) => (
							<TableRow
								key={item.id}
								className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2"
							>
								<TableCell className="pl-3.5">
									<Typography tag="span"
										className={cn(
											"block size-[7px] rounded-full",
											EVENT_DOT[item.eventType] ?? "bg-acc",
										)}
									/>
								</TableCell>
								<TableCell className="py-3 pl-3.5 text-t-2">
									{t(`admin.featureFlags.history.eventType.${item.eventType}`)}
								</TableCell>
								<TableCell className="py-3 pl-3.5">
									<Typography tag="span" className="rounded-[5px] border border-bd-1 bg-surf-2 px-1.5 py-0.5 font-mono text-[11px] text-t-2">
										{item.flagKey}
									</Typography>
								</TableCell>
								<TableCell className="py-3 pl-3.5 text-[11.5px]">
									{item.actor ? (
										<Typography tag="span" className="text-acc-t font-medium">
											{item.actor.name} {item.actor.surname}
										</Typography>
									) : (
										<Typography tag="span" className="text-t-3">{t("admin.featureFlags.history.system")}</Typography>
									)}
								</TableCell>
								<TableCell className="py-3 pl-3.5 pr-3.5 text-right text-[11px] text-t-3">
									{formatDate(item.createdAt)}
								</TableCell>
							</TableRow>
						))}
			</TableBody>
		</Table>
	</div>
);
