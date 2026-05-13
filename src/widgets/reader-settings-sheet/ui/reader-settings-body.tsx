"use client";

import { useDeleteAllHighlights, useHighlights } from "@/entities/highlight";
import { FontFamilyGroup } from "@/features/reader-font-family";
import { FontSizeGroup } from "@/features/reader-font-size";
import { useHighlightVisibility } from "@/features/reader-highlight";
import {
	ColumnWidthGroup,
	SegmentedGroup,
	useReaderTextLayout,
} from "@/features/reader-text-width";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import {
	LETTER_SPACING_OPTIONS,
	LINE_HEIGHT_OPTIONS,
	PAGE_PADDING_OPTIONS,
	PARAGRAPH_SPACING_OPTIONS,
	READER_SETTINGS_LEGEND,
} from "../lib/reader-settings-form-config";
import { ReaderSettingsSectionLabel } from "./reader-settings-section-label";
import { ReaderThemeSelector } from "./reader-theme-selector";

export interface ReaderSettingsBodyProps {
	compact?: boolean;
	textId?: string;
	pageNumber?: number;
}

export const ReaderSettingsBody = ({
	compact = false,
	textId,
	pageNumber,
}: ReaderSettingsBodyProps) => {
	const { t } = useI18n();
	const layout = useReaderTextLayout();
	const gap = compact ? "mb-3" : "mb-5";
	const btnH = compact ? "h-8" : "h-10";
	const { highlightsVisible, setHighlightsVisible } = useHighlightVisibility();
	const { data: highlights = [] } = useHighlights(
		textId ?? "",
		pageNumber ?? 0,
		{ enabled: !!textId && !!pageNumber },
	);
	const { mutate: deleteAll, isPending: isDeletingAll } =
		useDeleteAllHighlights(textId ?? "", pageNumber ?? 0);

	const hasHighlights = !!textId && !!pageNumber && highlights.length > 0;

	const handleToggleHighlights = () => setHighlightsVisible(!highlightsVisible);
	const handleDeleteAllHighlights = () => {
		if (!hasHighlights) return;
		deleteAll(highlights.map(h => h.id));
	};

	return (
		<>
			<ReaderSettingsSectionLabel
				label={t("reader.settings.theme")}
				compact={compact}
			/>
			<ReaderThemeSelector compact={compact} />

			<ReaderSettingsSectionLabel
				label={t("reader.settings.size")}
				compact={compact}
			/>
			<FontSizeGroup
				className={cn("grid grid-cols-5", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={cn("w-full font-medium", btnH)}
			/>

			<ReaderSettingsSectionLabel
				label={t("reader.settings.font")}
				compact={compact}
			/>
			<FontFamilyGroup
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<ReaderSettingsSectionLabel
				label={t("reader.settings.columnWidth")}
				compact={compact}
			/>
			<ColumnWidthGroup
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<ReaderSettingsSectionLabel
				label={t("reader.settings.pagePadding")}
				compact={compact}
			/>
			<SegmentedGroup
				options={PAGE_PADDING_OPTIONS.map(o => ({
					value: o.value,
					label: t(o.labelKey),
				}))}
				value={layout.pagePadding}
				onChange={layout.setPagePadding}
				ariaLabel={t("reader.settings.pagePadding")}
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<ReaderSettingsSectionLabel
				label={t("reader.settings.lineHeight")}
				compact={compact}
			/>
			<SegmentedGroup
				options={LINE_HEIGHT_OPTIONS.map(o => ({
					value: o.value,
					label: t(o.labelKey),
				}))}
				value={layout.lineHeight}
				onChange={layout.setLineHeight}
				ariaLabel={t("reader.settings.lineHeight")}
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<ReaderSettingsSectionLabel
				label={t("reader.settings.letterSpacing")}
				compact={compact}
			/>
			<SegmentedGroup
				options={LETTER_SPACING_OPTIONS.map(o => ({
					value: o.value,
					label: t(o.labelKey),
				}))}
				value={layout.letterSpacing}
				onChange={layout.setLetterSpacing}
				ariaLabel={t("reader.settings.letterSpacing")}
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<ReaderSettingsSectionLabel
				label={t("reader.settings.paragraphSpacing")}
				compact={compact}
			/>
			<SegmentedGroup
				options={PARAGRAPH_SPACING_OPTIONS.map(o => ({
					value: o.value,
					label: t(o.labelKey),
				}))}
				value={layout.paragraphSpacing}
				onChange={layout.setParagraphSpacing}
				ariaLabel={t("reader.settings.paragraphSpacing")}
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>
			<ReaderSettingsSectionLabel
				label={t("reader.settings.highlights")}
				compact={compact}
			/>
			<div className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}>
				<button
					onClick={handleToggleHighlights}
					aria-pressed={highlightsVisible}
					className={cn(
						"flex flex-1 items-center justify-center gap-1.5 rounded-base border border-bd-1 text-t-2 transition-colors",
						"hover:bg-surf-2 hover:text-t-1",
						"aria-pressed:bg-acc-bg aria-pressed:text-acc-t aria-pressed:border-acc/30",
						btnH,
						compact ? "text-[11px]" : "text-[12.5px]",
					)}
				>
					{highlightsVisible ? (
						<Eye
							className={compact ? "size-3" : "size-3.5"}
							strokeWidth={1.6}
						/>
					) : (
						<EyeOff
							className={compact ? "size-3" : "size-3.5"}
							strokeWidth={1.6}
						/>
					)}
					{highlightsVisible
						? t("reader.settings.highlightsHide")
						: t("reader.settings.highlightsShow")}
				</button>
				<button
					onClick={handleDeleteAllHighlights}
					disabled={!hasHighlights || isDeletingAll}
					className={cn(
						"flex flex-1 items-center justify-center gap-1.5 rounded-base border border-bd-1 text-t-3 transition-colors",
						"hover:border-red-300 hover:bg-red-50 hover:text-red-600",
						"disabled:pointer-events-none disabled:opacity-35",
						btnH,
						compact ? "text-[11px]" : "text-[12.5px]",
					)}
				>
					<Trash2
						className={compact ? "size-3" : "size-3.5"}
						strokeWidth={1.6}
					/>
					{t("reader.settings.highlightsClearAll")}
				</button>
			</div>

			<ReaderSettingsSectionLabel
				label={t("reader.settings.legend")}
				compact={compact}
			/>
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
							className={cn(
								"block h-0.5 w-3.5 rounded-[1px]",
								item.swatchClass,
							)}
						/>
						{t(`reader.learnStatus.${item.key}`)}
					</div>
				))}
			</div>
		</>
	);
};
