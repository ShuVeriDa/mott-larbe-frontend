"use client";

import { useI18n } from "@/shared/lib/i18n";

export const PaymentEmptyPanel = () => {
	const { t } = useI18n();

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
			<div className="flex flex-col items-center gap-2 px-4 py-9">
				<div className="flex size-9 items-center justify-center rounded-[10px] bg-surf-2 text-t-4">
					<svg
						viewBox="0 0 18 18"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
						className="size-[18px]"
					>
						<rect x="1.5" y="3.5" width="15" height="11" rx="2" />
						<path d="M1.5 7.5h15" strokeLinecap="round" />
						<path d="M4.5 11h4" strokeLinecap="round" />
					</svg>
				</div>
				<div className="text-[13px] font-semibold text-t-1">
					{t("admin.payments.detail.emptyTitle")}
				</div>
				<div className="text-center text-[11.5px] leading-[1.5] text-t-3">
					{t("admin.payments.detail.emptySub")}
				</div>
			</div>
		</div>
	);
};
