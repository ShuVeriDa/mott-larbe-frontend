"use client";

import type { LibraryTextListItem } from "@/entities/library-text";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type { LibraryPreviewLevelStyle } from "../lib/library-preview-level-styles";
import { getLibraryPreviewProgressBarColor } from "../lib/library-preview-level-styles";

interface LibraryPreviewCardFooterProps {
	item: Pick<LibraryTextListItem, "wordCount">;
	pct: number;
	colors: LibraryPreviewLevelStyle;
}

export const LibraryPreviewCardFooter = ({
	item,
	pct,
	colors,
}: LibraryPreviewCardFooterProps) => {
	const { t } = useI18n();

	return (
		<>
			<div className="mb-[7px] h-[2px] overflow-hidden rounded-[2px] bg-surf-3">
				<div
					className="h-full rounded-[2px] transition-[width]"
					style={{
						width: `${pct}%`,
						background: getLibraryPreviewProgressBarColor(pct, colors.stripe),
					}}
				/>
			</div>

			<div className="flex items-center justify-between">
				<Typography tag="span" className="text-[11px] text-t-3">
					{t("dashboard.library.words", {
						count: item.wordCount.toLocaleString(),
					})}
				</Typography>
				{pct > 0 ? (
					<Typography
						tag="span"
						className="text-[11px] font-semibold"
						style={{ color: colors.stripe }}
					>
						{pct}%
					</Typography>
				) : (
					<Typography
						tag="span"
						className="text-[11px] font-medium text-t-3"
					>
						{t("dashboard.library.newText")}
					</Typography>
				)}
			</div>
		</>
	);
};
