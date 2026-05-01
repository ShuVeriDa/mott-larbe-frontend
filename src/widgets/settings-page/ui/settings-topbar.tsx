"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

export const SettingsTopbar = () => {
	const { t } = useI18n();
	return (
		<div className="flex shrink-0 items-center gap-3 border-hairline border-b border-bd-1 bg-surf px-5 py-3 transition-colors max-sm:px-4">
			<Typography tag="h1" className="text-[13.5px] font-semibold text-t-1">
				{t("settings.pageTitle")}
			</Typography>
		</div>
	);
};
