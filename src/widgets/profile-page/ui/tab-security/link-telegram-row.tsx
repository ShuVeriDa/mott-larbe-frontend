"use client";

import { Send } from "lucide-react";
import { TelegramWidget } from "@/features/login";
import { useLinkTelegramAccount } from "@/features/link-telegram-account";
import type { TelegramAuthData } from "@/entities/auth";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Typography } from "@/shared/ui/typography";

export const LinkTelegramRow = () => {
	const { t } = useI18n();
	const { success } = useToast();
	const { mutate: linkTelegram } = useLinkTelegramAccount();

	const handleAuth = (data: TelegramAuthData) => {
		linkTelegram(data, {
			onSuccess: () => success(t("profile.security.connectedAccounts.linkedSuccess")),
		});
	};

	return (
		<div className="flex items-center gap-3 border-b-[0.5px] border-bd-1 px-4 py-3 last:border-b-0">
			<Typography
				tag="span"
				className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-surf-2"
			>
				<Send className="size-4" />
			</Typography>
			<div className="flex-1 min-w-0">
				<Typography tag="p" className="text-[12.5px] font-medium text-t-1 mb-0.5">
					Telegram
				</Typography>
				<Typography tag="p" className="text-[11px] text-t-3">
					{t("profile.security.connectedAccounts.notLinked")}
				</Typography>
			</div>
			<TelegramWidget onAuth={handleAuth} />
		</div>
	);
};
