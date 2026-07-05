"use client";

import { useState } from "react";

import { usePwaPlatform, useInstallPrompt } from "@/entities/pwa-install";

import { usePromptDismissal } from "./dismissal";
import type { BannerVariant } from "./types";

export const usePwaInstallPrompt = () => {
	const { platform, isStandalone } = usePwaPlatform();
	const { isAvailable, triggerInstall } = useInstallPrompt();
	const { isDismissed, dismiss } = usePromptDismissal();
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	const variant: BannerVariant =
		isStandalone || isDismissed
			? "hidden"
			: platform === "ios"
				? "ios-guide"
				: platform === "android" || platform === "desktop-chromium"
					? isAvailable
						? "chromium-prompt"
						: "link-to-guide"
					: "hidden";

	const handleInstallClick = async () => {
		if (variant === "ios-guide") {
			setIsSheetOpen(true);
			return;
		}
		const outcome = await triggerInstall();
		if (outcome) dismiss();
	};

	const handleCloseSheet = () => setIsSheetOpen(false);
	const handleDismiss = dismiss;

	return {
		variant,
		isSheetOpen,
		handleInstallClick,
		handleCloseSheet,
		handleDismiss,
	};
};
