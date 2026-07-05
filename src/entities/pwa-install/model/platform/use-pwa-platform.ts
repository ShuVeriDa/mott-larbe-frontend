"use client";

import { useEffect, useState } from "react";

import { detectPlatform } from "./detect-platform";
import type { PwaPlatform } from "../types";

interface NavigatorWithIosStandalone extends Navigator {
	standalone?: boolean;
}

export const usePwaPlatform = () => {
	const [platform, setPlatform] = useState<PwaPlatform>("unsupported");
	const [isStandalone, setIsStandalone] = useState(false);

	useEffect(() => {
		setPlatform(detectPlatform(navigator.userAgent, navigator.maxTouchPoints));

		const mql = window.matchMedia("(display-mode: standalone)");
		const iosStandalone = (navigator as NavigatorWithIosStandalone).standalone === true;
		setIsStandalone(mql.matches || iosStandalone);

		const handleChange = (e: MediaQueryListEvent) => setIsStandalone(e.matches);
		mql.addEventListener("change", handleChange);
		return () => mql.removeEventListener("change", handleChange);
	}, []);

	return { platform, isStandalone };
};
