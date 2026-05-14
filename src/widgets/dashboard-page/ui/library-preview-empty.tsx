"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { SlidersHorizontal } from "lucide-react";

export const LibraryPreviewEmpty = () => {
	const { t } = useI18n();

	return (
		<div className="flex h-[400px] flex-col items-center justify-center gap-1.5 rounded-card border border-hairline border-bd-1 bg-surf-2">
			<SlidersHorizontal className="size-4 text-t-3" strokeWidth={1.5} />
			<Typography tag="span" className="text-[12.5px] font-medium text-t-2">
				{t("dashboard.library.emptyTitle")}
			</Typography>
			<Typography tag="span" className="text-[11px] text-t-3">
				{t("dashboard.library.emptyDesc")}
			</Typography>
		</div>
	);
};
