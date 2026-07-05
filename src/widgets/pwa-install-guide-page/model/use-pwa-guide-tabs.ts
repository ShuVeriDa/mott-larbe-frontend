"use client";

import { useEffect, useState } from "react";

import { usePwaPlatform } from "@/entities/pwa-install";

import type { PwaGuideTab } from "./types";

const platformToTab: Record<string, PwaGuideTab> = {
	ios: "ios",
	android: "android",
	"desktop-chromium": "desktop",
};

export const usePwaGuideTabs = () => {
	const { platform } = usePwaPlatform();
	const [tab, setTab] = useState<PwaGuideTab>("ios");
	const [hasAutoSelected, setHasAutoSelected] = useState(false);

	useEffect(() => {
		if (hasAutoSelected) return;
		const detectedTab = platformToTab[platform];
		if (!detectedTab) return;
		setTab(detectedTab);
		setHasAutoSelected(true);
	}, [platform, hasAutoSelected]);

	const handleTabChange = (value: string) => setTab(value as PwaGuideTab);

	return { tab, handleTabChange };
};
