import { useI18n } from "@/shared/lib/i18n";
import { AdminEmptyPanel } from "@/shared/ui/admin-empty-panel";
import { User } from "lucide-react";

export const SubscriptionEmptyPanel = () => {
	const { t } = useI18n();

	return (
		<AdminEmptyPanel
			icon={<User className="size-[18px]" />}
			title={t("admin.subscriptions.detail.emptyTitle")}
			description={t("admin.subscriptions.detail.emptySub")}
		/>
	);
};
