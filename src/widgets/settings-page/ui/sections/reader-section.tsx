"use client";

import {
	useUpdatePreferences,
	type PopupMode,
	type UserPreferences,
} from "@/entities/settings";
import { FontSizeControl } from "@/features/font-size";
import { FontFamilyGroup } from "@/features/reader-font-family";
import {
	useReaderSettingsInit,
	useReaderSettingsSync,
} from "@/features/reader-settings-sync";
import { useReaderTextLayout } from "@/features/reader-text-width";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import {
	LETTER_SPACING_OPTIONS,
	LINE_HEIGHT_OPTIONS,
	PAGE_PADDING_OPTIONS,
	PARAGRAPH_SPACING_OPTIONS,
} from "@/widgets/reader-settings-sheet/lib/reader-settings-form-config";
import { ComponentProps } from "react";
import { SectionHeader } from "../section-header";
import { SelectRow } from "../select-row";
import { SettingCard } from "../setting-card";
import { ThemeRow } from "../theme-row";
import { ToggleRow } from "../toggle-row";

export interface ReaderSectionProps {
	preferences: UserPreferences;
}

interface PopupOption {
	value: PopupMode;
	labelKey: string;
	descKey: string;
}

const POPUP_OPTIONS: PopupOption[] = [
	{
		value: "POPUP",
		labelKey: "settings.reader.popup",
		descKey: "settings.reader.popupDesc",
	},
	{
		value: "SIDEBAR",
		labelKey: "settings.reader.sidebar",
		descKey: "settings.reader.sidebarDesc",
	},
	{
		value: "BOTH",
		labelKey: "settings.reader.both",
		descKey: "settings.reader.bothDesc",
	},
];

export const ReaderSection = ({ preferences }: ReaderSectionProps) => {
	const { t } = useI18n();
	const { mutateAsync } = useUpdatePreferences();
	const { success } = useToast();
	const layout = useReaderTextLayout();

	useReaderSettingsInit();
	useReaderSettingsSync();

	const updatePopup = async (mode: PopupMode) => {
		try {
			await mutateAsync({ popupMode: mode });
			success(t("settings.toasts.saved"));
		} catch {}
	};

	const togglePref = async (patch: Partial<UserPreferences>) => {
		try {
			await mutateAsync(patch);
			success(t("settings.toasts.saved"));
		} catch {}
	};

	const handleHighlightChange: NonNullable<
		ComponentProps<typeof ToggleRow>["onChange"]
	> = v => togglePref({ highlightKnown: v });
	const handleProgressChange: NonNullable<
		ComponentProps<typeof ToggleRow>["onChange"]
	> = v => togglePref({ showProgress: v });

	return (
		<div className="flex flex-col gap-3.5">
			<SectionHeader
				title={t("settings.reader.title")}
				subtitle={t("settings.reader.sub")}
			/>

			<SettingCard title={t("settings.reader.fontSize")} noBody>
				<FontSizeControl />
			</SettingCard>

			<SettingCard title={t("settings.reader.typography")} noBody>
				<div className="flex flex-col gap-1.5 border-b-[0.5px] border-bd-1 px-4 py-3">
					<div>
						<Typography tag="p" className="text-[13px] font-medium text-t-1">
							{t("settings.reader.fontFamily")}
						</Typography>
						<Typography
							tag="p"
							className="mt-0.5 text-[11.5px] leading-normal text-t-3"
						>
							{t("settings.reader.fontFamilyDesc")}
						</Typography>
					</div>
					<FontFamilyGroup />
				</div>
				<SelectRow
					label={t("settings.reader.columnWidth")}
					description={t("settings.reader.columnWidthDesc")}
					options={[
						{ value: "xs", label: "XS" },
						{ value: "sm", label: "S" },
						{ value: "md", label: "M" },
						{ value: "lg", label: "L" },
						{ value: "full", label: "Full" },
					]}
					value={layout.columnWidth}
					onChange={layout.setColumnWidth}
				/>
				<SelectRow
					label={t("settings.reader.pagePadding")}
					description={t("settings.reader.pagePaddingDesc")}
					options={PAGE_PADDING_OPTIONS.map(o => ({
						value: o.value,
						label: t(o.labelKey),
					}))}
					value={layout.pagePadding}
					onChange={layout.setPagePadding}
				/>
				<SelectRow
					label={t("settings.reader.lineHeight")}
					description={t("settings.reader.lineHeightDesc")}
					options={LINE_HEIGHT_OPTIONS.map(o => ({
						value: o.value,
						label: t(o.labelKey),
					}))}
					value={layout.lineHeight}
					onChange={layout.setLineHeight}
				/>
				<SelectRow
					label={t("settings.reader.letterSpacing")}
					description={t("settings.reader.letterSpacingDesc")}
					options={LETTER_SPACING_OPTIONS.map(o => ({
						value: o.value,
						label: t(o.labelKey),
					}))}
					value={layout.letterSpacing}
					onChange={layout.setLetterSpacing}
				/>
				<SelectRow
					label={t("settings.reader.paragraphSpacing")}
					description={t("settings.reader.paragraphSpacingDesc")}
					options={PARAGRAPH_SPACING_OPTIONS.map(o => ({
						value: o.value,
						label: t(o.labelKey),
					}))}
					value={layout.paragraphSpacing}
					onChange={layout.setParagraphSpacing}
				/>
				<ThemeRow
					label={t("settings.reader.readerTheme")}
					description={t("settings.reader.readerThemeDesc")}
				/>
			</SettingCard>

			<SettingCard title={t("settings.reader.popupMode")} noBody>
				<div className="flex flex-col">
					{POPUP_OPTIONS.map(opt => {
						const selected = preferences.popupMode === opt.value;
						const handleClick: NonNullable<
							ComponentProps<"button">["onClick"]
						> = () => updatePopup(opt.value);
						return (
							<Button
								key={opt.value}
								onClick={handleClick}
								aria-pressed={selected}
								variant="bare"
								className={cn(
									"flex items-center rounded-none min-h-10 gap-2.5 border-b-[0.5px] border-bd-1 px-4 py-2.5 text-left transition-colors last:border-b-0",
									"hover:bg-surf-2",
								)}
							>
								<Typography
									tag="span"
									className={cn(
										"flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px]",
										selected ? "border-acc" : "border-bd-2",
									)}
								>
									{selected ? (
										<Typography
											tag="span"
											className="block size-2 rounded-full bg-acc"
										/>
									) : null}
								</Typography>
								<Typography tag="span" className="flex-1">
									<Typography
										tag="span"
										className="block text-[12.5px] font-medium text-t-1"
									>
										{t(opt.labelKey)}
									</Typography>
									<Typography
										tag="span"
										className="block text-[11.5px] text-t-3"
									>
										{t(opt.descKey)}
									</Typography>
								</Typography>
							</Button>
						);
					})}
				</div>
			</SettingCard>

			<SettingCard title={t("settings.reader.display")} noBody>
				<ToggleRow
					label={t("settings.reader.highlightKnown")}
					description={t("settings.reader.highlightKnownDesc")}
					checked={preferences.highlightKnown}
					onChange={handleHighlightChange}
				/>
				<ToggleRow
					label={t("settings.reader.showProgress")}
					description={t("settings.reader.showProgressDesc")}
					checked={preferences.showProgress}
					onChange={handleProgressChange}
				/>
			</SettingCard>
		</div>
	);
};
