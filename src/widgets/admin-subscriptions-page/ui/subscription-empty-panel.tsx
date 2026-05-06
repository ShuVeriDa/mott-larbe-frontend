import { useI18n } from "@/shared/lib/i18n";

export const SubscriptionEmptyPanel = () => {
	const { t } = useI18n();
	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
			<div className="flex flex-col items-center gap-2 px-4 py-9">
				<div className="flex size-9 items-center justify-center rounded-[10px] bg-surf-2 text-t-4">
					<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" className="size-[18px]">
						<circle cx="9" cy="6" r="3" />
						<path d="M3 15c0-3.31 2.69-6 6-6s6 2.69 6 6" strokeLinecap="round" />
					</svg>
				</div>
				<div className="text-[13px] font-semibold text-t-1">
					{t("admin.subscriptions.detail.emptyTitle")}
				</div>
				<div className="text-center text-[11.5px] leading-relaxed text-t-3">
					{t("admin.subscriptions.detail.emptySub")}
				</div>
			</div>
		</div>
	);
};
