"use client";

import { Typography } from "@/shared/ui/typography";

import { FontSizeGroup } from "@/features/reader-font-size";
import { FontFamilyGroup } from "@/features/reader-font-family";
import { useReaderTheme } from "@/features/reader-theme";
import {
	ColumnWidthGroup,
	SegmentedGroup,
	useReaderTextLayout,
	type ReaderPagePadding,
	type ReaderLineHeight,
	type ReaderLetterSpacing,
} from "@/features/reader-text-width";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import {
	READER_MOBILE_SHEET_OVERLAY_CLASSES,
	ReaderMobileSheetHeader,
} from "@/shared/ui/reader-mobile-sheet-header";
import { X } from "lucide-react";
import type { ChangeEvent, MouseEvent } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

const LEGEND = [
	{ key: "KNOWN", swatchClass: "bg-[var(--grn)]" },
	{ key: "LEARNING", swatchClass: "bg-[var(--amb)]" },
	{ key: "NEW", swatchClass: "bg-[var(--t-4)]" },
] as const;

export interface ReaderSettingsSheetProps {
	open: boolean;
	onClose: () => void;
}

const useEscapeToClose = (open: boolean, onClose: () => void) => {
	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, onClose]);
};

const SectionLabel = ({ label, compact }: { label: string; compact: boolean }) => (
	<div
		className={cn(
			"text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3",
			compact ? "mb-1" : "mb-2",
		)}
	>
		{label}
	</div>
);

const PAGE_PADDING_OPTIONS: Array<{ value: ReaderPagePadding; labelKey: string }> = [
	{ value: "compact", labelKey: "reader.settings.paddingCompact" },
	{ value: "normal", labelKey: "reader.settings.paddingNormal" },
	{ value: "wide", labelKey: "reader.settings.paddingWide" },
];

const LINE_HEIGHT_OPTIONS: Array<{ value: ReaderLineHeight; labelKey: string }> = [
	{ value: "compact", labelKey: "reader.settings.lineCompact" },
	{ value: "normal", labelKey: "reader.settings.lineNormal" },
	{ value: "relaxed", labelKey: "reader.settings.lineRelaxed" },
];

const LETTER_SPACING_OPTIONS: Array<{ value: ReaderLetterSpacing; labelKey: string }> = [
	{ value: "tight", labelKey: "reader.settings.spacingTight" },
	{ value: "normal", labelKey: "reader.settings.spacingNormal" },
	{ value: "wide", labelKey: "reader.settings.spacingWide" },
];

const THEME_SWATCHES: Array<{ value: "default" | "sepia"; color: string; labelKey: string }> = [
	{ value: "default", color: "#ffffff", labelKey: "reader.settings.themeDefault" },
	{ value: "sepia", color: "#f4efe6", labelKey: "reader.settings.themeSepia" },
];

const ThemeSelector = ({ compact }: { compact: boolean }) => {
	const { t } = useI18n();
	const theme = useReaderTheme(s => s.theme);
	const bgColor = useReaderTheme(s => s.bgColor);
	const setTheme = useReaderTheme(s => s.setTheme);
	const setBgColor = useReaderTheme(s => s.setBgColor);

	const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
		setBgColor(e.currentTarget.value);
		setTheme("custom");
	};

	const size = compact ? "size-7" : "size-9";

	return (
		<div className={cn("flex items-center gap-2", compact ? "mb-3" : "mb-5")}>
			{THEME_SWATCHES.map(swatch => {
				const isActive = theme === swatch.value;
				const handleClick = () => setTheme(swatch.value);
				return (
					<button
						key={swatch.value}
						type="button"
						onClick={handleClick}
						aria-label={t(swatch.labelKey)}
						aria-pressed={isActive}
						className={cn(
							"shrink-0 rounded-full border-2 transition-colors",
							size,
							isActive ? "border-acc" : "border-bd-2 hover:border-bd-3",
						)}
						style={{ backgroundColor: swatch.color }}
					/>
				);
			})}
			{/* Custom color */}
			<label
				aria-label={t("reader.settings.themeCustom")}
				className={cn(
					"relative shrink-0 cursor-pointer rounded-full border-2 transition-colors",
					size,
					theme === "custom" ? "border-acc" : "border-bd-2 hover:border-bd-3",
				)}
				style={{
					background:
						theme === "custom"
							? bgColor
							: "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
				}}
			>
				<input
					type="color"
					value={bgColor}
					onChange={handleColorChange}
					className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
					aria-hidden="true"
				/>
			</label>
		</div>
	);
};

const ReaderSettingsBody = ({ compact = false }: { compact?: boolean }) => {
	const { t } = useI18n();
	const layout = useReaderTextLayout();
	const gap = compact ? "mb-3" : "mb-5";
	const btnH = compact ? "h-8" : "h-10";

	return (
		<>
			<SectionLabel label={t("reader.settings.theme")} compact={compact} />
			<ThemeSelector compact={compact} />
			<SectionLabel label={t("reader.settings.size")} compact={compact} />
			<FontSizeGroup
				className={cn("grid grid-cols-5", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={cn("w-full font-medium", btnH)}
			/>

			<SectionLabel label={t("reader.settings.font")} compact={compact} />
			<FontFamilyGroup
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<SectionLabel label={t("reader.settings.columnWidth")} compact={compact} />
			<ColumnWidthGroup
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<SectionLabel label={t("reader.settings.pagePadding")} compact={compact} />
			<SegmentedGroup
				options={PAGE_PADDING_OPTIONS.map(o => ({ value: o.value, label: t(o.labelKey) }))}
				value={layout.pagePadding}
				onChange={layout.setPagePadding}
				ariaLabel={t("reader.settings.pagePadding")}
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<SectionLabel label={t("reader.settings.lineHeight")} compact={compact} />
			<SegmentedGroup
				options={LINE_HEIGHT_OPTIONS.map(o => ({ value: o.value, label: t(o.labelKey) }))}
				value={layout.lineHeight}
				onChange={layout.setLineHeight}
				ariaLabel={t("reader.settings.lineHeight")}
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<SectionLabel label={t("reader.settings.letterSpacing")} compact={compact} />
			<SegmentedGroup
				options={LETTER_SPACING_OPTIONS.map(o => ({ value: o.value, label: t(o.labelKey) }))}
				value={layout.letterSpacing}
				onChange={layout.setLetterSpacing}
				ariaLabel={t("reader.settings.letterSpacing")}
				className={cn("flex", gap, compact ? "gap-1" : "gap-1.5")}
				buttonClassName={btnH}
			/>

			<SectionLabel label={t("reader.settings.legend")} compact={compact} />
			<div className={cn("flex flex-wrap", compact ? "gap-4" : "gap-2.5")}>
				{LEGEND.map(item => (
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

const SettingsChromeHeader = ({ onClose }: { onClose: () => void }) => {
	const { t } = useI18n();
	const handleCloseClick = () => onClose();

	return (
		<div className="flex shrink-0 items-center justify-between border-b border-hairline border-bd-1 px-3.5 py-2.5">
			<Typography
				tag="span"
				className="text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3"
			>
				{t("reader.settings.title")}
			</Typography>
			<Button
				onClick={handleCloseClick}
				aria-label={t("reader.panel.close")}
				className="inline-flex size-6 items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<X className="size-3" strokeWidth={1.6} />
			</Button>
		</div>
	);
};

/** Desktop / tablet — same sliding rail styling as `WordPanel`. */
export const ReaderSettingsAside = ({
	open,
	onClose,
}: ReaderSettingsSheetProps) => {
	useEscapeToClose(open, onClose);

	return (
		<aside
			aria-hidden={!open}
			className={cn(
				"flex shrink-0 flex-col overflow-hidden bg-surf max-md:hidden",
				"border-l border-hairline transition-[border-color] duration-200",
				open ? "w-[296px] border-bd-1" : "w-0 min-w-0 border-l-transparent",
			)}
		>
			<SettingsChromeHeader onClose={onClose} />
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-2">
				<ReaderSettingsBody compact />
			</div>
		</aside>
	);
};

/** Small screens — bottom sheet (+ backdrop); hidden from `md` up via CSS where aside is shown. */
export const ReaderSettingsSheet = ({
	open,
	onClose,
}: ReaderSettingsSheetProps) => {
	const { t } = useI18n();
	useEscapeToClose(open, onClose);

	const handleBackdropClick = () => onClose();
	const handleSheetClick = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
	};

	if (!open || typeof window === "undefined") return null;

	return createPortal(
		<div
			role="presentation"
			className={READER_MOBILE_SHEET_OVERLAY_CLASSES}
			onClick={handleBackdropClick}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={t("reader.settings.title")}
				className="flex max-h-[82vh] min-h-0 w-full flex-col rounded-t-2xl border-t border-bd-1 bg-surf"
				onClick={handleSheetClick}
			>
				<ReaderMobileSheetHeader
					title={t("reader.settings.title")}
					closeAriaLabel={t("reader.panel.close")}
					onClose={onClose}
				/>
				<div className="min-h-0 flex-1 overflow-y-auto p-4">
					<ReaderSettingsBody />
				</div>
			</div>
		</div>,
		document.body,
	);
};
