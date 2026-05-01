"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { useUpdateUser } from "@/entities/user";
import type { UserProfile } from "@/entities/user";
import { ProfileCard as SettingCard } from "../profile-card";

export interface PersonalDataCardProps {
	profile: UserProfile;
}

export const PersonalDataCard = ({ profile }: PersonalDataCardProps) => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const { mutateAsync, isPending } = useUpdateUser();

	const [name, setName] = useState(profile.name ?? "");
	const [surname, setSurname] = useState(profile.surname ?? "");
	const [username, setUsername] = useState(profile.username);
	const [phone, setPhone] = useState(profile.phone ?? "");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			await mutateAsync({
				name: name.trim() || undefined,
				surname: surname.trim() || undefined,
				username: username.trim() || undefined,
				phone: phone.trim() || null,
			});
			success(t("profile.toasts.saved"));
		} catch {
			error(t("profile.toasts.error"));
		}
	};

	return (
		<SettingCard title={t("profile.personalData.title")}>
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
					<div>
						<InputLabel htmlFor="profile-name">{t("profile.personalData.firstName")}</InputLabel>
						<Input
							id="profile-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder={t("profile.personalData.firstNamePlaceholder")}
						/>
					</div>
					<div>
						<InputLabel htmlFor="profile-surname">{t("profile.personalData.lastName")}</InputLabel>
						<Input
							id="profile-surname"
							value={surname}
							onChange={(e) => setSurname(e.target.value)}
							placeholder={t("profile.personalData.lastNamePlaceholder")}
						/>
					</div>
				</div>

				<div>
					<InputLabel htmlFor="profile-username">{t("profile.personalData.username")}</InputLabel>
					<Input
						id="profile-username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="username"
					/>
				</div>

				<div>
					<InputLabel htmlFor="profile-email">{t("profile.personalData.email")}</InputLabel>
					<Input
						id="profile-email"
						type="email"
						value={profile.email}
						disabled
						className="opacity-60 cursor-not-allowed"
					/>
					<p className="mt-1 text-[11px] text-t-3">{t("profile.personalData.emailHint")}</p>
				</div>

				<div>
					<InputLabel htmlFor="profile-phone">{t("profile.personalData.phone")}</InputLabel>
					<Input
						id="profile-phone"
						type="tel"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						placeholder="+7 900 000-00-00"
					/>
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
