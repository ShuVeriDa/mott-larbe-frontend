export type PwaGuideTab = "ios" | "android" | "desktop";

export interface PwaGuideStepsText {
	step1: string;
	step2: string;
	step3: string;
}

export interface PwaGuideTabsText {
	ios: string;
	android: string;
	desktop: string;
}

export interface PwaGuideBenefitsText {
	title: string;
	explainer: string;
	offline: string;
	quickAccess: string;
	noStore: string;
}

export interface PwaGuideContent {
	pageTitle: string;
	tabs: PwaGuideTabsText;
	iosCta: string;
	iosSteps: PwaGuideStepsText;
	androidSteps: PwaGuideStepsText;
	desktopSteps: PwaGuideStepsText;
	benefits: PwaGuideBenefitsText;
}
