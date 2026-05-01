"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

export const SubscriptionTopbar = () => {
	const { t } = useI18n();
	return (
		<header className="flex shrink-0 items-center gap-2.5 border-hairline border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors duration-200 max-md:gap-2 max-md:px-[14px] max-md:py-2.5">
			<Typography
				tag="h1"
				className="text-[13.5px] font-semibold text-t-1 max-md:text-[15px]"
			>
				{t("subscription.title")}
			</Typography>
		</header>
	);
};
