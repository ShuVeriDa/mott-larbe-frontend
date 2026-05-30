"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

export const DashboardHeader = () => {
	const { t } = useI18n();

	return (
		<header className="flex shrink-0 items-center border-b-[0.5px] border-bd-1 bg-surf px-[22px] py-3 max-md:px-4 max-sm:px-3.5 max-sm:py-2.5">
			<Typography tag="span" className="text-[13.5px] font-semibold text-t-1">
				{t("dashboard.pageTitle")}
			</Typography>
		</header>
	);
};
