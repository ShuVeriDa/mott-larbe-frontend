"use client";

import { useEffect } from "react";
import type { TelegramAuthData } from "@/entities/auth";

declare global {
	interface Window {
		onTelegramAuth?: (user: TelegramAuthData) => void;
	}
}

export const useTelegramWidget = (onAuth: (data: TelegramAuthData) => void) => {
	useEffect(() => {
		window.onTelegramAuth = onAuth;
		return () => {
			delete window.onTelegramAuth;
		};
	}, [onAuth]);
};
