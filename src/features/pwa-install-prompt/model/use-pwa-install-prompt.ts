"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { usePwaPlatform, useInstallPrompt } from "@/entities/pwa-install";

import { usePromptDismissal } from "./dismissal";
import type { BannerVariant } from "./types";

const isPwaGuidePath = (pathname: string) => /^\/[a-z]{2,3}\/pwa-guide(\/.*)?$/.test(pathname);

export const usePwaInstallPrompt = () => {
	const pathname = usePathname();
	const { platform, isStandalone } = usePwaPlatform();
	const { isAvailable, triggerInstall } = useInstallPrompt();
	const { isDismissed, dismiss } = usePromptDismissal();
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	const variant: BannerVariant =
		isStandalone || isDismissed || isPwaGuidePath(pathname)
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
