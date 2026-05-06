import type { FeatureFlagOverrideItem } from "@/entities/feature-flag";
import { cn } from "@/shared/lib/cn";

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });

const AV_COLORS = [
	"bg-pur-bg text-pur-t",
	"bg-grn-bg text-grn-t",
	"bg-amb-bg text-amb-t",
	"bg-acc-bg text-acc-t",
	"bg-surf-3 text-t-2",
];
const getAvColor = (id: string) => AV_COLORS[id.charCodeAt(0) % AV_COLORS.length];

interface OverridesTableProps {
	items: FeatureFlagOverrideItem[];
	isLoading: boolean;
	onDelete: (overrideId: string) => void;
	t: (key: string, params?: Record<string, string | number>) => string;
}

const SkeletonRow = () => (
	<tr>
		{Array.from({ length: 6 }).map((_, i) => (
			<td key={i} className="px-3.5 py-3">
				<div className="h-3 animate-pulse rounded bg-surf-3" />
			</td>
		))}
	</tr>
);

export const OverridesTable = ({ items, isLoading, onDelete, t }: OverridesTableProps) => (
	<div className="overflow-x-auto">
		<table className="w-full border-collapse text-[12.5px]">
			<thead>
				<tr>
					<th className="border-b border-bd-1 pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.overrides.user")}
					</th>
					<th className="border-b border-bd-1 pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.overrides.flag")}
					</th>
					<th className="w-[80px] border-b border-bd-1 pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.overrides.value")}
					</th>
					<th className="w-[150px] border-b border-bd-1 pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.overrides.global")}
					</th>
					<th className="w-[140px] border-b border-bd-1 pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.overrides.setBy")}
					</th>
					<th className="w-[90px] border-b border-bd-1 pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{t("admin.featureFlags.overrides.date")}
					</th>
					<th className="w-12 border-b border-bd-1 pb-2 pr-3.5" />
				</tr>
			</thead>
			<tbody>
				{isLoading
					? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
					: items.map((item) => {
							const initials = (
								(item.user.name?.[0] ?? "") + (item.user.surname?.[0] ?? "")
							).toUpperCase() || item.user.email[0].toUpperCase();
							return (
								<tr
									key={item.id}
									className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2"
								>
									<td className="py-3 pl-3.5">
										<div className="flex items-center gap-2">
											<div
												className={cn(
													"flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold",
													getAvColor(item.user.id),
												)}
											>
												{initials}
											</div>
											<div>
												<p className="text-[12.5px] text-t-1">
													{item.user.name} {item.user.surname}
												</p>
												<p className="text-[11px] text-t-3">{item.user.email}</p>
											</div>
										</div>
									</td>
									<td className="py-3 pl-3.5">
										<span className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap rounded-[5px] border border-bd-1 bg-surf-2 px-1.5 py-0.5 font-mono text-[11px] text-t-2 block">
											{item.featureFlag.key}
										</span>
									</td>
									<td className="py-3 pl-3.5">
										{item.isEnabled ? (
											<span className="rounded px-1.5 py-[2px] text-[11px] font-semibold bg-grn-bg text-grn-t">
												{t("admin.featureFlags.overrides.on")}
											</span>
										) : (
											<span className="rounded px-1.5 py-[2px] text-[11px] font-semibold bg-red-bg text-red-t">
												{t("admin.featureFlags.overrides.off")}
											</span>
										)}
									</td>
									<td className="py-3 pl-3.5">
										{item.featureFlag.isEnabled === false ? (
											<span className="rounded px-1.5 py-[2px] text-[10.5px] font-medium bg-red-bg text-red-t">
												{t("admin.featureFlags.overrides.globalOff")}
											</span>
										) : item.featureFlag.rolloutPercent === 100 ? (
											<span className="rounded px-1.5 py-[2px] text-[10.5px] font-medium bg-grn-bg text-grn-t">
												{t("admin.featureFlags.overrides.globalOn", { pct: item.featureFlag.rolloutPercent })}
											</span>
										) : (
											<span className="rounded px-1.5 py-[2px] text-[10.5px] font-medium bg-amb-bg text-amb-t">
												{t("admin.featureFlags.overrides.globalOn", { pct: item.featureFlag.rolloutPercent })}
											</span>
										)}
									</td>
									<td className="py-3 pl-3.5 text-[11.5px] text-t-3">
										{item.setBy
											? `${item.setBy.name} ${item.setBy.surname}`
											: "—"}
									</td>
									<td className="py-3 pl-3.5 text-[11.5px] text-t-3">
										{formatDate(item.updatedAt)}
									</td>
									<td className="py-3 pr-3.5">
										<button
											type="button"
											onClick={() => onDelete(item.id)}
											className="flex size-[26px] cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
											title={t("admin.featureFlags.overrides.remove")}
										>
											<svg className="size-3.5" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
												<path d="M2.5 4.5h10M5 4.5V3h5v1.5M6 7v4M9 7v4" strokeLinecap="round" />
												<path d="M3.5 4.5l.7 7.5h6.6l.7-7.5" />
											</svg>
										</button>
									</td>
								</tr>
							);
						})}
			</tbody>
		</table>
	</div>
);
