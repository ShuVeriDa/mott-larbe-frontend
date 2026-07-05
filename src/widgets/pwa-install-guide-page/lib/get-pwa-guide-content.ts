import type { Dictionary } from "@/i18n/locales";
import type { PwaGuideContent } from "../model/types";

interface PwaGuideDictShape {
	pwaInstall?: {
		ios?: { cta?: string; step1?: string; step2?: string; step3?: string };
		android?: { step1?: string; step2?: string; step3?: string };
		desktop?: { step1?: string; step2?: string; step3?: string };
		guide?: {
			title?: string;
			tabs?: { ios?: string; android?: string; desktop?: string };
			benefits?: {
				title?: string;
				explainer?: string;
				offline?: string;
				quickAccess?: string;
				noStore?: string;
			};
		};
	};
}

export const getPwaGuideContent = (dict: Dictionary): PwaGuideContent => {
	const pwaInstall = (dict as PwaGuideDictShape).pwaInstall;
	const guide = pwaInstall?.guide;

	return {
		pageTitle: guide?.title ?? "Install as an app",
		tabs: {
			ios: guide?.tabs?.ios ?? "iPhone / iPad",
			android: guide?.tabs?.android ?? "Android",
			desktop: guide?.tabs?.desktop ?? "Desktop",
		},
		iosCta: pwaInstall?.ios?.cta ?? "How to install on iPhone",
		iosSteps: {
			step1: pwaInstall?.ios?.step1 ?? "",
			step2: pwaInstall?.ios?.step2 ?? "",
			step3: pwaInstall?.ios?.step3 ?? "",
		},
		androidSteps: {
			step1: pwaInstall?.android?.step1 ?? "",
			step2: pwaInstall?.android?.step2 ?? "",
			step3: pwaInstall?.android?.step3 ?? "",
		},
		desktopSteps: {
			step1: pwaInstall?.desktop?.step1 ?? "",
			step2: pwaInstall?.desktop?.step2 ?? "",
			step3: pwaInstall?.desktop?.step3 ?? "",
		},
		benefits: {
			title: guide?.benefits?.title ?? "This is a real app",
			explainer: guide?.benefits?.explainer ?? "",
			offline: guide?.benefits?.offline ?? "",
			quickAccess: guide?.benefits?.quickAccess ?? "",
			noStore: guide?.benefits?.noStore ?? "",
		},
	};
};
