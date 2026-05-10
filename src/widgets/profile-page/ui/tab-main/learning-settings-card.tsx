"use client";
import { ComponentProps, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { InputLabel } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { useUpdateUser } from "@/entities/user";
import type { UserLanguage, UserLevel, UserProfile } from "@/entities/user";
import { ProfileCard as SettingCard } from "../profile-card";

const LANGUAGES: { value: UserLanguage; label: string }[] = [
	{ value: "CHE", label: "settings.learning.learningLangChe" },
	{ value: "RU", label: "settings.learning.learningLangRu" },
];

const LEVELS: { value: UserLevel; label: string }[] = [
	{ value: "A1", label: "settings.learning.levelA1" },
	{ value: "A2", label: "settings.learning.levelA2" },
	{ value: "B1", label: "settings.learning.levelB1" },
	{ value: "B2", label: "settings.learning.levelB2" },
	{ value: "C1", label: "settings.learning.levelC1" },
	{ value: "C2", label: "settings.learning.levelC2" },
];


export interface LearningSettingsCardProps {
	profile: UserProfile;
}

export const LearningSettingsCard = ({ profile }: LearningSettingsCardProps) => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const { mutateAsync, isPending } = useUpdateUser();

	const [language, setLanguage] = useState<UserLanguage>(profile.language ?? "CHE");
	const [level, setLevel] = useState<UserLevel>(profile.level ?? "A1");

	const handleSubmit = async () => {
		try {
			await mutateAsync({ language, level });
			success(t("profile.toasts.saved"));
		} catch {
			error(t("profile.toasts.error"));
		}
	};

		const handleChange: NonNullable<ComponentProps<"select">["onChange"]> = (e) => setLanguage(e.currentTarget.value as UserLanguage);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = (e) => setLevel(e.currentTarget.value as UserLevel);
return (
		<SettingCard title={t("profile.learningSettings.title")}>
			<form action={handleSubmit} className="flex flex-col gap-3">
				<div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
					<div>
						<InputLabel htmlFor="profile-language">
							{t("settings.learning.learningLang")}
						</InputLabel>
						<Select
							variant="lg"
							id="profile-language"
							value={language}
							onChange={handleChange}
						>
							{LANGUAGES.map(({ value, label }) => (
								<option key={value} value={value}>
									{t(label)}
								</option>
							))}
						</Select>
					</div>
					<div>
						<InputLabel htmlFor="profile-level">
							{t("settings.learning.level")}
						</InputLabel>
						<Select
							variant="lg"
							id="profile-level"
							value={level}
							onChange={handleChange2}
						>
							{LEVELS.map(({ value, label }) => (
								<option key={value} value={value}>
									{t(label)}
								</option>
							))}
						</Select>
					</div>
				</div>

				<div className="flex justify-end mt-1 max-sm:justify-stretch">
					<Button
						type="submit"
						variant="action"
						disabled={isPending}
						className="max-sm:w-full max-sm:h-10 max-sm:text-[13px] max-sm:rounded-[8px]"
					>
						{isPending ? t("profile.toasts.saving") : t("profile.common.save")}
					</Button>
				</div>
			</form>
		</SettingCard>
	);
};
