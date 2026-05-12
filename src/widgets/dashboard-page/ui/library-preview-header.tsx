"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";

export interface LibraryPreviewHeaderProps {
	viewAllHref: string;
}

export const LibraryPreviewHeader = ({ viewAllHref }: LibraryPreviewHeaderProps) => {
	const { t } = useI18n();

	return (
		<div className="mb-2.5 flex items-center justify-between gap-2">
			<Typography tag="span" className="text-[13px] font-semibold text-t-1">
				{t("dashboard.library.title")}
			</Typography>
			<Link
				href={viewAllHref}
				className="shrink-0 text-[11.5px] text-acc transition-colors hover:underline"
			>
				{t("dashboard.library.viewAll")}
			</Link>
		</div>
	);
};
