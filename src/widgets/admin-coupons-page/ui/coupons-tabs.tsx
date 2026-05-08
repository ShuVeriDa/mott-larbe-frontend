import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { CouponsTab } from "../model/use-admin-coupons-page";

interface Props {
	active: CouponsTab;
	counts: Record<CouponsTab, number>;
	onChange: (tab: CouponsTab) => void;
}

const TABS: CouponsTab[] = ["all", "active", "expired", "exhausted"];

export const CouponsTabs = ({ active, counts, onChange }: Props) => {
	const { t } = useI18n();

	const labels: Record<CouponsTab, string> = {
		all: t("admin.coupons.tabs.all"),
		active: t("admin.coupons.tabs.active"),
		expired: t("admin.coupons.tabs.expired"),
		exhausted: t("admin.coupons.tabs.exhausted"),
	};

	return (
		<div className="overflow-x-auto border-b border-bd-1 px-3.5 pb-0 pt-2.5 [&::-webkit-scrollbar]:h-0">
			<div className="flex w-fit gap-0.5 rounded-[9px] border border-bd-1 bg-surf-2 p-[3px]">
				{TABS.map(tab => (
					<button
						key={tab}
						type="button"
						onClick={() => onChange(tab)}
						className={cn(
							"flex h-[26px] items-center gap-1 whitespace-nowrap rounded-base px-2.5 text-[12px] transition-colors",
							active === tab
								? "bg-surf font-medium text-t-1 shadow-[0_1px_3px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.04)]"
								: "text-t-2 hover:bg-surf-3 hover:text-t-1",
						)}
					>
						{labels[tab]}
						<span
							className={cn(
								"rounded px-1 py-px text-[10px] font-semibold",
								active === tab ? "bg-surf-2 text-t-3" : "bg-surf-3 text-t-3",
							)}
						>
							{counts[tab]}
						</span>
					</button>
				))}
			</div>
		</div>
	);
};
