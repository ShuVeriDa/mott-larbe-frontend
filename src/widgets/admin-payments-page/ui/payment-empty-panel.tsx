"use client";

import { useI18n } from "@/shared/lib/i18n";
import { AdminEmptyPanel } from "@/shared/ui/admin-empty-panel";
import { CreditCard } from "lucide-react";

export const PaymentEmptyPanel = () => {
	const { t } = useI18n();

	return (
		<AdminEmptyPanel
			icon={<CreditCard className="size-[18px]" />}
			title={t("admin.payments.detail.emptyTitle")}
			description={t("admin.payments.detail.emptySub")}
		/>
	);
};
