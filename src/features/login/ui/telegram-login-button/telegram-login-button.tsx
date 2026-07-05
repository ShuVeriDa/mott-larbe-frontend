"use client";

import { useRouter } from "next/navigation";
import type { TelegramAuthData } from "@/entities/auth";
import { useTelegramLogin } from "../../model/use-telegram-login";
import { TelegramWidget } from "./telegram-widget";

interface TelegramLoginButtonProps {
	successHref: string;
}

export const TelegramLoginButton = ({ successHref }: TelegramLoginButtonProps) => {
	const router = useRouter();
	const { mutate: loginWithTelegram } = useTelegramLogin();

	const handleAuth = (data: TelegramAuthData) => {
		loginWithTelegram(data, {
			onSuccess: () => {
				router.push(successHref);
				router.refresh();
			},
		});
	};

	return <TelegramWidget onAuth={handleAuth} />;
};
