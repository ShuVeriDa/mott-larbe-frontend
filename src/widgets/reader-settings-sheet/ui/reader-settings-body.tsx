"use client";

import { useDeleteAllHighlights, useHighlights } from "@/entities/highlight";
import { scriptVersionsQueryOptions } from "@/entities/text-script-version";
import { FontFamilyGroup } from "@/features/reader-font-family";
import { Button } from "@/shared/ui/button";
import { FontSizeSlider } from "@/features/reader-font-size";
import { useHighlightVisibility, usePhraseColorVisibility } from "@/features/reader-highlight";
import {
	ColumnWidthGroup,
	SegmentedGroup,
	useReaderTextLayout,
} from "@/features/reader-text-width";
import {
	SCRIPT_OPTIONS,
	useReaderScript,
	useReaderScriptAvailability,
} from "@/features/reader-script";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { Eye, EyeOff, Languages, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
	WORD_SPACING_OPTIONS,
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
	hideFontSize?: boolean;
}

export const ReaderSettingsBody = ({
	compact = false,
	textId,
	pageNumber,
	hideFontSize = false,
}: ReaderSettingsBodyProps) => {
	const { t } = useI18n();
	const layout = useReaderTextLayout();
	const { script, showDiacritics, setScript, setShowDiacritics } = useReaderScript();
	const { data: scriptVersions = [] } = useQuery({
		...scriptVersionsQueryOptions(textId ?? ""),
		enabled: !!textId,
	});
	const available = useReaderScriptAvailability(scriptVersions);
	const visibleScripts = SCRIPT_OPTIONS.filter(o => available.includes(o.value));
	const hasMultipleScripts = visibleScripts.length > 1;
	const isArabic = script === "ARABIC";
	const gap = compact ? "mb-3" : "mb-5";
	const btnH = compact ? "h-8" : "h-10";
	const { highlightsVisible, setHighlightsVisible } = useHighlightVisibility();
	const { phraseColorVisible, setPhraseColorVisible } = usePhraseColorVisibility();
	const { data: highlights = [] } = useHighlights(
		textId ?? "",
		pageNumber ?? 0,
		{ enabled: !!textId && !!pageNumber },
	);
	const { mutate: deleteAll, isPending: isDeletingAll } =
		useDeleteAllHighlights(textId ?? "", pageNumber ?? 0);

	const hasHighlights = !!textId && !!pageNumber && highlights.length > 0;

	const handleToggleHighlights = () => setHighlightsVisible(!highlightsVisible);
	const handleTogglePhraseColor = () => setPhraseColorVisible(!phraseColorVisible);
	const handleDeleteAllHighlights = () => {
		if (!hasHighlights) return;
		deleteAll(highlights.map(h => h.id));
	};

	const handleToggleDiacritics = () => setShowDiacritics(!showDiacritics);

	return (
		<>
			{hasMultipleScripts && (
				<div className="md:hidden">
					<ReaderSettingsSectionLabel
						label={t("reader.settings.script.switchScript")}
						compact={compact}
					/>
					<div className={cn("flex flex-wrap", gap, compact ? "gap-1" : "gap-1.5")}>
						{visibleScripts.map(option => {
							const active = script === option.value;
							const handleClick = () => setScript(option.value);
							return (
								<Button
									key={option.value}
									variant="bare"
									size={null}
									onClick={handleClick}
									aria-pressed={active}
									className={cn(
										"flex-1 rounded-base border border-bd-1 leading-none transition-colors duration-100",
										btnH,
										compact ? "text-[11px]" : "text-[13px]",
										active
											? "border-acc/20 bg-acc-bg text-acc-t"
											: "bg-surf-2 text-t-2 hover:border-bd-2 hover:text-t-1",
									)}
								>
									{t(option.fullKey)}
								</Button>
							);
						})}
					</div>
					{isArabic && (
						<Button
							variant="bare"
							size={null}
							onClick={handleToggleDiacritics}
							aria-pressed={showDiacritics}
							className={cn(
								"w-full rounded-base border border-bd-1 leading-none transition-colors duration-100",
								gap,
								btnH,
								compact ? "text-[11px]" : "text-[13px]",
								showDiacritics
									? "border-acc/20 bg-acc-bg text-acc-t"
									: "bg-surf-2 text-t-2 hover:border-bd-2 hover:text-t-1",
							)}
						>
							{showDiacritics
								? t("reader.settings.script.diacriticsHide")
								: t("reader.settings.script.diacriticsShow")}
						</Button>
					)}
				</div>
			)}

			<ReaderSettingsSectionLabel
				label={t("reader.settings.theme")}
				compact={compact}
			/>
			<ReaderThemeSelector compact={compact} />

			{!hideFontSize && (
				<>
					<ReaderSettingsSectionLabel
						label={t("reader.settings.size")}
						compact={compact}
					/>
					<FontSizeSlider className={gap} />
				</>
			)}

			<ReaderSettingsSectionLabel
				label={t("reader.settings.font")}
				compact={compact}
			/>
			<FontFamilyGroup
				fullWidth
				className={gap}
			/>

			<div className="max-[767px]:hidden">
				<ReaderSettingsSectionLabel
					label={t("reader.settings.columnWidth")}
					compact={compact}
				/>
				<ColumnWidthGroup
					className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
					buttonClassName={btnH}
				/>
			</div>

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
				label={t("reader.settings.wordSpacing")}
				compact={compact}
			/>
			<SegmentedGroup
				options={WORD_SPACING_OPTIONS.map(o => ({
					value: o.value,
					label: t(o.labelKey),
				}))}
				value={layout.wordSpacing}
				onChange={layout.setWordSpacing}
				ariaLabel={t("reader.settings.wordSpacing")}
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<ReaderSettingsSectionLabel
				label={t("reader.settings.highlights")}
				compact={compact}
			/>
			<div className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}>
				<Button
					onClick={handleToggleHighlights}
					title={highlightsVisible ? t("reader.settings.highlightsHide") : t("reader.settings.highlightsShow")}
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
				</Button>
				<Button
					onClick={handleDeleteAllHighlights}
					title={t("reader.settings.highlightsClearAll")}
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
				</Button>
			</div>

			<ReaderSettingsSectionLabel
				label={t("reader.settings.phraseColor")}
				compact={compact}
			/>
			<Button
				onClick={handleTogglePhraseColor}
				title={phraseColorVisible ? t("reader.settings.phraseColorHide") : t("reader.settings.phraseColorShow")}
				aria-pressed={phraseColorVisible}
				className={cn(
					"flex w-full items-center justify-center gap-1.5 rounded-base border border-bd-1 text-t-2 transition-colors",
					"hover:bg-surf-2 hover:text-t-1",
					"aria-pressed:bg-acc-bg aria-pressed:text-acc-t aria-pressed:border-acc/30",
					btnH,
					compact ? "text-[11px] mb-3" : "text-[12.5px] mb-5",
				)}
			>
				<Languages className={compact ? "size-3" : "size-3.5"} strokeWidth={1.6} />
				{phraseColorVisible
					? t("reader.settings.phraseColorHide")
					: t("reader.settings.phraseColorShow")}
			</Button>

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
