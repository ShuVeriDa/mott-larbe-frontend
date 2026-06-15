import { useI18n } from "@/shared/lib/i18n";
import { AdminEmptyPanel } from "@/shared/ui/admin-empty-panel";
import { Code2 } from "lucide-react";

export const CouponEmptyPanel = () => {
	const { t } = useI18n();

	return (
		<AdminEmptyPanel
			icon={<Code2 className="size-[18px]" />}
			title={t("admin.coupons.detail.empty")}
			description={t("admin.coupons.detail.emptySub")}
			className="py-10"
		/>
	);
};
