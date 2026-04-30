"use client";

import type { DemoWordEntry } from "@/entities/landing";
import { useI18n } from "@/shared/lib/i18n";
import { LandingCta } from "@/widgets/landing-cta";
import { LandingDemo } from "@/widgets/landing-demo";
import { LandingFaq } from "@/widgets/landing-faq";
import { LandingFeatures } from "@/widgets/landing-features";
import { LandingFooter } from "@/widgets/landing-footer";
import { LandingHero } from "@/widgets/landing-hero";
import { LandingHowItWorks } from "@/widgets/landing-how-it-works";
import { LandingNav } from "@/widgets/landing-nav";
import { LandingPricing } from "@/widgets/landing-pricing";
import { LandingStats } from "@/widgets/landing-stats";

export const LandingPage = () => {
	const { lang, dict } = useI18n();
	const loginHref = `/${lang}/login`;
	const startHref = `/${lang}/register`;

	const wordsDict =
		((
			dict as unknown as {
				landing?: { demoWords?: Record<string, DemoWordEntry> };
			}
		).landing?.demoWords as Record<string, DemoWordEntry>) ?? {};

	return (
		<div className="flex min-h-dvh flex-col bg-bg">
			<LandingNav loginHref={loginHref} startHref={startHref} />
			<main className="flex-1">
				<LandingHero startHref={startHref} />
				<LandingStats />
				<LandingFeatures />
				<LandingHowItWorks />
				<LandingDemo wordsDict={wordsDict} />
				<LandingPricing startHref={startHref} />
				<LandingFaq />
				<LandingCta startHref={startHref} loginHref={loginHref} />
			</main>
			<LandingFooter />
		</div>
	);
};
