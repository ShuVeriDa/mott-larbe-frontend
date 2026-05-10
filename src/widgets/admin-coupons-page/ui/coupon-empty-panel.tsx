import { useI18n } from "@/shared/lib/i18n";
import { Code2 } from "lucide-react";

export const CouponEmptyPanel = () => {
	const { t } = useI18n();

	return (
		<div className="overflow-hidden rounded-[11px] border border-bd-1 bg-surf">
			<div className="flex flex-col items-center gap-2 px-4 py-10">
				<div className="flex size-9 items-center justify-center rounded-[10px] bg-surf-2 text-t-4">
					<Code2 className="size-[18px]" />
				</div>
				<div className="text-[13px] font-semibold text-t-1">{t("admin.coupons.detail.empty")}</div>
				<div className="text-center text-[11.5px] leading-relaxed text-t-3">{t("admin.coupons.detail.emptySub")}</div>
			</div>
		</div>
	);
};
