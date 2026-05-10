import { useI18n } from "@/shared/lib/i18n";
import { User } from "lucide-react";

export const SubscriptionEmptyPanel = () => {
	const { t } = useI18n();
	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
			<div className="flex flex-col items-center gap-2 px-4 py-9">
				<div className="flex size-9 items-center justify-center rounded-[10px] bg-surf-2 text-t-4">
					<User className="size-[18px]" />
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
