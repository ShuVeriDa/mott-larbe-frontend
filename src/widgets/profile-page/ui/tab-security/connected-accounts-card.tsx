"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi, linkedAccountsQueryOptions } from "@/entities/auth";
import type { UserProfile } from "@/entities/user";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ProfileCard as SettingCard } from "../profile-card";
import { ConnectedAccountRow } from "./connected-account-row";
import { LinkGoogleRow } from "./link-google-row";
import { LinkTelegramRow } from "./link-telegram-row";
import { LockIcon } from "./security-card-icons";

export interface ConnectedAccountsCardProps {
	profile: UserProfile;
}

export const ConnectedAccountsCard = ({ profile }: ConnectedAccountsCardProps) => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data } = useQuery(linkedAccountsQueryOptions());

	useEffect(() => {
		if (searchParams.get("linked") !== "google") return;
		success(t("profile.security.connectedAccounts.linkedSuccess"));
		const params = new URLSearchParams(searchParams.toString());
		params.delete("linked");
		router.replace(`?${params.toString()}`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	if (!data) return null;

	const { hasPassword, accounts } = data;
	const canUnlink = hasPassword || accounts.length > 1;
	const hasGoogle = accounts.some(a => a.provider === "GOOGLE");
	const hasTelegram = accounts.some(a => a.provider === "TELEGRAM");

	const handleSetPasswordClick = async () => {
		try {
			await authApi.requestPasswordReset({ email: profile.email });
			success(t("profile.security.connectedAccounts.setPasswordSent"));
		} catch {
			error(t("profile.toasts.error"));
		}
	};

	return (
		<SettingCard title={t("profile.security.connectedAccounts.title")} noBody>
			{accounts.map(account => (
				<ConnectedAccountRow key={account.id} account={account} canUnlink={canUnlink} />
			))}

			{!hasGoogle ? <LinkGoogleRow /> : null}
			{!hasTelegram ? <LinkTelegramRow /> : null}

			{!hasPassword ? (
				<div className="flex items-center gap-3 px-4 py-3">
					<Typography
						tag="span"
						className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-acc-bg text-acc-t"
					>
						<LockIcon />
					</Typography>
					<div className="flex-1 min-w-0">
						<Typography tag="p" className="text-[12.5px] font-medium text-t-1 mb-0.5">
							{t("profile.security.connectedAccounts.setPasswordTitle")}
						</Typography>
						<Typography tag="p" className="text-[11px] text-t-3">
							{t("profile.security.connectedAccounts.setPasswordMeta")}
						</Typography>
					</div>
					<Button
						variant="outline"
						className="h-7 px-2.5 text-[11.5px] shrink-0"
						onClick={handleSetPasswordClick}
					>
						{t("profile.security.connectedAccounts.setPassword")}
					</Button>
				</div>
			) : null}
		</SettingCard>
	);
};
