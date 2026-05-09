"use client";

import { Typography } from "@/shared/ui/typography";

import { BookOpen } from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";

export const WordPanelEmpty = () => {
	const { t } = useI18n();
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
			<div className="mb-1 flex size-9 items-center justify-center rounded-[9px] bg-surf-2">
				<BookOpen className="size-4 text-t-3" strokeWidth={1.4} />
			</div>
			<div className="text-[13px] font-semibold text-t-2">
				{t("reader.panel.emptyTitle")}
			</div>
			<Typography tag="p" className="max-w-[200px] text-[11.5px] leading-[1.5] text-t-3">
				{t("reader.panel.emptyDesc")}
			</Typography>
		</div>
	);
};
