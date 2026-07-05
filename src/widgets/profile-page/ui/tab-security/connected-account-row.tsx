"use client";

import { Send } from "lucide-react";
import { GoogleIcon } from "@/features/login";
import { useUnlinkAccount } from "@/features/unlink-account";
import type { LinkedAccount } from "@/entities/auth";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { Typography } from "@/shared/ui/typography";

interface ConnectedAccountRowProps {
	account: LinkedAccount;
	canUnlink: boolean;
}

const PROVIDER_LABEL: Record<LinkedAccount["provider"], string> = {
	GOOGLE: "Google",
	TELEGRAM: "Telegram",
};

const ProviderIcon = ({ provider }: { provider: LinkedAccount["provider"] }) =>
	provider === "TELEGRAM" ? (
		<Send className="size-4" />
	) : (
		<GoogleIcon className="size-4" />
	);

export const ConnectedAccountRow = ({ account, canUnlink }: ConnectedAccountRowProps) => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const { mutate: unlink, isPending } = useUnlinkAccount();

	const handleUnlinkClick = () => {
		if (!window.confirm(t("profile.security.connectedAccounts.unlinkConfirm"))) return;
		unlink(account.id, {
			onSuccess: () => success(t("profile.security.connectedAccounts.unlinked")),
			onError: () => error(t("profile.toasts.error")),
		});
	};

	const unlinkButton = (
		<Button
			variant="outline"
			className="h-7 px-2.5 text-[11.5px] shrink-0"
			disabled={!canUnlink || isPending}
			onClick={handleUnlinkClick}
		>
			{t("profile.security.connectedAccounts.unlink")}
		</Button>
	);

	return (
		<div className="flex items-center gap-3 border-b-[0.5px] border-bd-1 px-4 py-3 last:border-b-0">
			<Typography
				tag="span"
				className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-surf-2"
			>
				<ProviderIcon provider={account.provider} />
			</Typography>
			<div className="flex-1 min-w-0">
				<Typography tag="p" className="text-[12.5px] font-medium text-t-1 mb-0.5">
					{PROVIDER_LABEL[account.provider]}
				</Typography>
				<Typography tag="p" className="text-[11px] text-t-3 truncate">
					{account.email}
				</Typography>
			</div>
			{canUnlink ? (
				unlinkButton
			) : (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<span>{unlinkButton}</span>
						</TooltipTrigger>
						<TooltipContent side="top">
							{t("profile.security.connectedAccounts.lastMethodHint")}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</div>
	);
};
