import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { SubscriptionsTab } from "@/entities/admin-subscription";

interface TabCounts {
	all: number;
	active: number;
	trialing: number;
	canceled: number;
	expired: number;
}

interface Props {
	active: SubscriptionsTab;
	counts: TabCounts;
	onChange: (tab: SubscriptionsTab) => void;
}

export const SubscriptionsTabs = ({ active, counts, onChange }: Props) => {
	const { t } = useI18n();

	const tabs: { key: SubscriptionsTab; label: string }[] = [
		{ key: "all", label: t("admin.subscriptions.tabs.all") },
		{ key: "active", label: t("admin.subscriptions.tabs.active") },
		{ key: "trialing", label: t("admin.subscriptions.tabs.trialing") },
		{ key: "canceled", label: t("admin.subscriptions.tabs.canceled") },
		{ key: "expired", label: t("admin.subscriptions.tabs.expired") },
	];

	return (
		<div className="border-b border-bd-1 px-3.5 pt-2.5">
			<div className="flex gap-0.5 rounded-[9px] border border-bd-1 bg-surf-2 p-[3px] w-fit overflow-x-auto [&::-webkit-scrollbar]:h-0">
				{tabs.map(({ key, label }) => (
					<button
						key={key}
						type="button"
						onClick={() => onChange(key)}
						className={cn(
							"flex h-[26px] shrink-0 items-center gap-1 rounded-[7px] px-3 text-[12px] transition-colors",
							active === key
								? "bg-surf font-medium text-t-1 shadow-[0_1px_3px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.04)]"
								: "text-t-2 hover:bg-surf-3 hover:text-t-1",
						)}
					>
						{label}
						<span
							className={cn(
								"rounded px-[5px] py-px text-[10px] font-semibold",
								active === key ? "bg-surf-2 text-t-3" : "bg-surf-3 text-t-3",
							)}
						>
							{counts[key]}
						</span>
					</button>
				))}
			</div>
		</div>
	);
};
