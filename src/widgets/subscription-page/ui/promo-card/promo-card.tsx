"use client";

import { PromoForm } from "@/features/redeem-promo";
import { useI18n } from "@/shared/lib/i18n";
import { SectionCard } from "../section-card";

export const PromoCard = () => {
	const { t } = useI18n();
	return (
		<SectionCard title={t("subscription.promo.title")}>
			<PromoForm />
		</SectionCard>
	);
};
