"use client";

import { Typography } from "@/shared/ui/typography";
import { type ComponentProps, useState } from "react";
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
	const { success } = useToast();
	const { mutateAsync, isPending } = useUpdateUser();

	const [name, setName] = useState(profile.name ?? "");
	const [surname, setSurname] = useState(profile.surname ?? "");
	const [username, setUsername] = useState(profile.username);
	const [phone, setPhone] = useState(profile.phone ?? "");

	const handleSubmit = async () => {
		try {
			await mutateAsync({
				name: name.trim() || undefined,
				surname: surname.trim() || undefined,
				username: username.trim() || undefined,
				phone: phone.trim() || null,
			});
			success(t("profile.toasts.saved"));
		} catch {}
	};

		const handleNameChange: NonNullable<ComponentProps<typeof Input>["onChange"]> = (e) =>
		setName(e.currentTarget.value);
	const handleSurnameChange: NonNullable<ComponentProps<typeof Input>["onChange"]> = (e) =>
		setSurname(e.currentTarget.value);
	const handleUsernameChange: NonNullable<ComponentProps<typeof Input>["onChange"]> = (e) =>
		setUsername(e.currentTarget.value);
	const handlePhoneChange: NonNullable<ComponentProps<typeof Input>["onChange"]> = (e) =>
		setPhone(e.currentTarget.value);

	return (
		<SettingCard title={t("profile.personalData.title")}>
			<form action={handleSubmit} className="flex flex-col gap-3">
				<div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
					<div>
						<InputLabel htmlFor="profile-name">{t("profile.personalData.firstName")}</InputLabel>
						<Input
							id="profile-name"
							value={name}
							onChange={handleNameChange}
							placeholder={t("profile.personalData.firstNamePlaceholder")}
						/>
					</div>
					<div>
						<InputLabel htmlFor="profile-surname">{t("profile.personalData.lastName")}</InputLabel>
						<Input
							id="profile-surname"
							value={surname}
							onChange={handleSurnameChange}
							placeholder={t("profile.personalData.lastNamePlaceholder")}
						/>
					</div>
				</div>

				<div>
					<InputLabel htmlFor="profile-username">{t("profile.personalData.username")}</InputLabel>
					<Input
						id="profile-username"
						value={username}
						onChange={handleUsernameChange}
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
					<Typography tag="p" className="mt-1 text-[12px] text-t-3">{t("profile.personalData.emailHint")}</Typography>
				</div>

				<div>
					<InputLabel htmlFor="profile-phone">{t("profile.personalData.phone")}</InputLabel>
					<Input
						id="profile-phone"
						type="tel"
						value={phone}
						onChange={handlePhoneChange}
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
