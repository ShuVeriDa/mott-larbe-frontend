"use client";

import Script from "next/script";
import { TELEGRAM_BOT_USERNAME } from "@/shared/config";
import type { TelegramAuthData } from "@/entities/auth";
import { useTelegramWidget } from "./use-telegram-widget";

interface TelegramWidgetProps {
	onAuth: (data: TelegramAuthData) => void;
}

export const TelegramWidget = ({ onAuth }: TelegramWidgetProps) => {
	useTelegramWidget(onAuth);

	if (!TELEGRAM_BOT_USERNAME) return null;

	return (
		<div className="flex w-full justify-center">
			<Script
				src="https://telegram.org/js/telegram-widget.js?22"
				strategy="afterInteractive"
				data-telegram-login={TELEGRAM_BOT_USERNAME}
				data-size="large"
				data-onauth="onTelegramAuth(user)"
				data-radius="9"
			/>
		</div>
	);
};
