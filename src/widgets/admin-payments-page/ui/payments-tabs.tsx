"use client";

import type { PaymentUiTab } from "@/entities/admin-payment";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

interface Props {
	active: PaymentUiTab;
	counts: Record<PaymentUiTab, number>;
	onChange: (tab: PaymentUiTab) => void;
}

const TABS: { key: PaymentUiTab; i18nKey: string }[] = [
	{ key: "all", i18nKey: "admin.payments.tabs.all" },
	{ key: "paid", i18nKey: "admin.payments.tabs.paid" },
	{ key: "refunded", i18nKey: "admin.payments.tabs.refunded" },
	{ key: "failed", i18nKey: "admin.payments.tabs.failed" },
];

export const PaymentsTabs = ({ active, counts, onChange }: Props) => {
	const { t } = useI18n();

	return (
		<div className="overflow-x-auto border-b border-bd-1 px-3.5 pt-2.5 pb-0 [&::-webkit-scrollbar]:h-0">
			<div className="flex w-fit gap-0.5 rounded-[9px] border border-bd-1 bg-surf-2 p-[3px]">
				{TABS.map(({ key, i18nKey }) => (
					<button
						key={key}
						type="button"
						onClick={() => onChange(key)}
						className={cn(
							"flex h-[26px] items-center gap-1 whitespace-nowrap rounded-base px-2.5 text-[12px] transition-colors",
							active === key
								? "bg-surf font-medium text-t-1 shadow-[0_1px_3px_rgba(0,0,0,0.07)]"
								: "text-t-2 hover:bg-surf-3 hover:text-t-1",
						)}
					>
						{t(i18nKey)}
						<span
							className={cn(
								"rounded px-[5px] py-px text-[10px] font-semibold text-t-3",
								active === key ? "bg-surf-2" : "bg-surf-3",
							)}
						>
							{counts[key].toLocaleString("ru-RU")}
						</span>
					</button>
				))}
			</div>
		</div>
	);
};
