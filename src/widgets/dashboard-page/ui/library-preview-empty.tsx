"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

export const LibraryPreviewEmpty = () => {
	const { t } = useI18n();

	return (
		<div className="flex h-[120px] items-center justify-center rounded-card border-hairline border border-bd-1 bg-surf-2">
			<Typography tag="span" className="text-[12.5px] text-t-3">
				{t("dashboard.library.newText")}
			</Typography>
		</div>
	);
};
