"use client";

import { cn } from "@/shared/lib/cn";
import {
	useUpdatePreferences,
	type PopupMode,
	type UserPreferences,
} from "@/entities/settings";
import { FontSizeControl } from "@/features/font-size";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Typography } from "@/shared/ui/typography";
import { SectionHeader } from "../section-header";
import { SettingCard } from "../setting-card";
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
	const { success, error } = useToast();

	const updatePopup = async (mode: PopupMode) => {
		try {
			await mutateAsync({ popupMode: mode });
			success(t("settings.toasts.saved"));
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

	const togglePref = async (patch: Partial<UserPreferences>) => {
		try {
			await mutateAsync(patch);
			success(t("settings.toasts.saved"));
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

	return (
		<div className="flex flex-col gap-3.5">
			<SectionHeader
				title={t("settings.reader.title")}
				subtitle={t("settings.reader.sub")}
			/>

			<SettingCard title={t("settings.reader.fontSize")} noBody>
				<FontSizeControl initialValue={preferences.fontSize} />
			</SettingCard>

			<SettingCard title={t("settings.reader.popupMode")} noBody>
				<div className="flex flex-col">
					{POPUP_OPTIONS.map((opt) => {
						const selected = preferences.popupMode === opt.value;
						return (
							<button
								key={opt.value}
								type="button"
								onClick={() => updatePopup(opt.value)}
								aria-pressed={selected}
								className={cn(
									"flex items-center gap-2.5 border-hairline border-b border-bd-1 px-4 py-2.5 text-left transition-colors last:border-b-0",
									"hover:bg-surf-2",
								)}
							>
								<span
									className={cn(
										"flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px]",
										selected ? "border-acc" : "border-bd-2",
									)}
								>
									{selected ? (
										<span className="block size-2 rounded-full bg-acc" />
									) : null}
								</span>
								<span className="flex-1">
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
								</span>
							</button>
						);
					})}
				</div>
			</SettingCard>

			<SettingCard title={t("settings.reader.display")} noBody>
				<ToggleRow
					label={t("settings.reader.highlightKnown")}
					description={t("settings.reader.highlightKnownDesc")}
					checked={preferences.highlightKnown}
					onChange={(v) => togglePref({ highlightKnown: v })}
				/>
				<ToggleRow
					label={t("settings.reader.showProgress")}
					description={t("settings.reader.showProgressDesc")}
					checked={preferences.showProgress}
					onChange={(v) => togglePref({ showProgress: v })}
				/>
				<ToggleRow
					label={t("settings.reader.autoNext")}
					description={t("settings.reader.autoNextDesc")}
					checked={preferences.autoNextPage}
					onChange={(v) => togglePref({ autoNextPage: v })}
				/>
			</SettingCard>
		</div>
	);
};
