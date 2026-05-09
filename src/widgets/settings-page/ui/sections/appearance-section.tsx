"use client";

import {
	useUpdatePreferences,
	type UiLanguage,
	type UserPreferences,
} from "@/entities/settings";
import { ThemeSwitcher } from "@/features/theme-switcher";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import { ComponentProps, type SyntheticEvent, useState } from 'react';
import { SectionHeader } from "../section-header";
import { SettingCard } from "../setting-card";

export interface AppearanceSectionProps {
	preferences: UserPreferences;
}

export const AppearanceSection = ({ preferences }: AppearanceSectionProps) => {
	const { t } = useI18n();
	const { mutateAsync, isPending } = useUpdatePreferences();
	const { success, error } = useToast();
	const [uiLanguage, setUiLanguage] = useState<UiLanguage>(
		preferences.uiLanguage,
	);

	const handleSave = async (
		e: SyntheticEvent<HTMLFormElement, SubmitEvent>,
	) => {
		e.preventDefault();
		try {
			await mutateAsync({ uiLanguage });
			success(t("settings.toasts.languageSaved"));
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

		const handleChange: NonNullable<ComponentProps<typeof Select>["onChange"]> = (e) => setUiLanguage(e.currentTarget.value as UiLanguage);
return (
		<div className="flex flex-col gap-3.5">
			<SectionHeader
				title={t("settings.appearance.title")}
				subtitle={t("settings.appearance.sub")}
			/>

			<SettingCard title={t("settings.appearance.theme")} noBody>
				<ThemeSwitcher value={preferences.theme} />
			</SettingCard>

			<SettingCard title={t("settings.appearance.language")}>
				<form onSubmit={handleSave} className="flex flex-col gap-2.5">
					<Select
						aria-label={t("settings.appearance.language")}
						value={uiLanguage}
						onChange={handleChange}
						wrapperClassName="max-w-[280px]"
					>
						<option value="RU">{t("settings.appearance.langRu")}</option>
						<option value="EN">{t("settings.appearance.langEn")}</option>
					</Select>
					<Typography tag="span" className="text-[11px] text-t-3">
						{t("settings.appearance.languageHint")}
					</Typography>
					<div className="mt-1 flex justify-end">
						<Button type="submit" variant="action" disabled={isPending}>
							{isPending
								? t("settings.common.saving")
								: t("settings.common.save")}
						</Button>
					</div>
				</form>
			</SettingCard>
		</div>
	);
};
