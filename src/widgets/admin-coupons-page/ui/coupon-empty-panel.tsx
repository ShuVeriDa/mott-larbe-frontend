import { useI18n } from "@/shared/lib/i18n";

export const CouponEmptyPanel = () => {
	const { t } = useI18n();

	return (
		<div className="overflow-hidden rounded-[11px] border border-bd-1 bg-surf">
			<div className="flex flex-col items-center gap-2 px-4 py-10">
				<div className="flex size-9 items-center justify-center rounded-[10px] bg-surf-2 text-t-4">
					<svg width="18" height="18" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
						<path d="M1.5 7.5h12M5.5 4.5l-4 3 4 3M9.5 4.5l4 3-4 3" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
				<div className="text-[13px] font-semibold text-t-1">{t("admin.coupons.detail.empty")}</div>
				<div className="text-center text-[11.5px] leading-relaxed text-t-3">{t("admin.coupons.detail.emptySub")}</div>
			</div>
		</div>
	);
};
