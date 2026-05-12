"use client";

import { FontFamilyGroup } from "@/features/reader-font-family";
import { FontSizeGroup } from "@/features/reader-font-size";
import {
	ColumnWidthGroup,
	SegmentedGroup,
	useReaderTextLayout,
} from "@/features/reader-text-width";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import {
	LETTER_SPACING_OPTIONS,
	LINE_HEIGHT_OPTIONS,
	PAGE_PADDING_OPTIONS,
	READER_SETTINGS_LEGEND,
} from "../lib/reader-settings-form-config";
import { ReaderSettingsSectionLabel } from "./reader-settings-section-label";
import { ReaderThemeSelector } from "./reader-theme-selector";

export interface ReaderSettingsBodyProps {
	compact?: boolean;
}

export const ReaderSettingsBody = ({ compact = false }: ReaderSettingsBodyProps) => {
	const { t } = useI18n();
	const layout = useReaderTextLayout();
	const gap = compact ? "mb-3" : "mb-5";
	const btnH = compact ? "h-8" : "h-10";

	return (
		<>
			<ReaderSettingsSectionLabel label={t("reader.settings.theme")} compact={compact} />
			<ReaderThemeSelector compact={compact} />

			<ReaderSettingsSectionLabel label={t("reader.settings.size")} compact={compact} />
			<FontSizeGroup
				className={cn("grid grid-cols-5", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={cn("w-full font-medium", btnH)}
			/>

			<ReaderSettingsSectionLabel label={t("reader.settings.font")} compact={compact} />
			<FontFamilyGroup
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<ReaderSettingsSectionLabel label={t("reader.settings.columnWidth")} compact={compact} />
			<ColumnWidthGroup
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<ReaderSettingsSectionLabel label={t("reader.settings.pagePadding")} compact={compact} />
			<SegmentedGroup
				options={PAGE_PADDING_OPTIONS.map(o => ({ value: o.value, label: t(o.labelKey) }))}
				value={layout.pagePadding}
				onChange={layout.setPagePadding}
				ariaLabel={t("reader.settings.pagePadding")}
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<ReaderSettingsSectionLabel label={t("reader.settings.lineHeight")} compact={compact} />
			<SegmentedGroup
				options={LINE_HEIGHT_OPTIONS.map(o => ({ value: o.value, label: t(o.labelKey) }))}
				value={layout.lineHeight}
				onChange={layout.setLineHeight}
				ariaLabel={t("reader.settings.lineHeight")}
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<ReaderSettingsSectionLabel label={t("reader.settings.letterSpacing")} compact={compact} />
			<SegmentedGroup
				options={LETTER_SPACING_OPTIONS.map(o => ({ value: o.value, label: t(o.labelKey) }))}
				value={layout.letterSpacing}
				onChange={layout.setLetterSpacing}
				ariaLabel={t("reader.settings.letterSpacing")}
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<ReaderSettingsSectionLabel label={t("reader.settings.legend")} compact={compact} />
			<div className={cn("flex flex-wrap", compact ? "gap-4" : "gap-2.5")}>
				{READER_SETTINGS_LEGEND.map(item => (
					<div
						key={item.key}
						className={cn(
							"flex items-center gap-2 text-t-2",
							compact ? "text-[12px]" : "gap-2.5 text-[13px]",
						)}
					>
						<Typography
							tag="span"
							aria-hidden="true"
							className={cn("block h-0.5 w-3.5 rounded-[1px]", item.swatchClass)}
						/>
						{t(`reader.learnStatus.${item.key}`)}
					</div>
				))}
			</div>
		</>
	);
};
