import { PromoForm } from "@/features/redeem-promo";
import { useI18n } from "@/shared/lib/i18n";
import { ProfileCard as SettingCard } from "../profile-card";

export const PromoCard = () => {
	const { t } = useI18n();
	return (
		<SettingCard title={t("profile.subscription.promoCode")} noBody>
			<PromoForm />
		</SettingCard>
	);
};
