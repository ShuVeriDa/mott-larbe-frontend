"use client";

import { LandingFooter } from "@/widgets/landing-footer";
import { LandingNav } from "@/widgets/landing-nav";
import { useI18n } from "@/shared/lib/i18n";
import { DeveloperPageCta } from "./developer-page-cta";
import { DeveloperPageHero } from "./developer-page-hero";
import { DeveloperPageProjects } from "./developer-page-projects";
import { DeveloperPageStack } from "./developer-page-stack";

export const DeveloperPage = () => {
	const { lang } = useI18n();
	const loginHref = `/${lang}/auth`;
	const startHref = `/${lang}/auth?mode=register`;

	return (
		<div className="flex min-h-dvh flex-col bg-bg">
			<LandingNav loginHref={loginHref} startHref={startHref} />
			<main className="flex-1">
				<DeveloperPageHero />
				<DeveloperPageStack />
				<DeveloperPageProjects />
				<DeveloperPageCta />
			</main>
			<LandingFooter />
		</div>
	);
};
