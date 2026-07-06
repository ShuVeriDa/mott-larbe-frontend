import { LandingCta } from "@/widgets/landing-cta";
import { LandingDemo } from "@/widgets/landing-demo";
import { LandingFaq } from "@/widgets/landing-faq";
import { LandingFeatures } from "@/widgets/landing-features";
import { LandingFooter } from "@/widgets/landing-footer";
import { LandingHero } from "@/widgets/landing-hero";
import { LandingHowItWorks } from "@/widgets/landing-how-it-works";
import { LandingLanguages } from "@/widgets/landing-languages";
import { LandingLevels } from "@/widgets/landing-levels";
import { LandingNav } from "@/widgets/landing-nav";
// import { LandingPricing } from "@/widgets/landing-pricing"; // hidden — all features are free
import { LandingStats } from "@/widgets/landing-stats";

interface LandingPageProps {
	lang: string;
}

export const LandingPage = ({ lang }: LandingPageProps) => {
	const loginHref = `/${lang}/auth`;
	const startHref = `/${lang}/auth?mode=register`;

	return (
		<div className="flex min-h-dvh flex-col bg-bg">
			<LandingNav loginHref={loginHref} startHref={startHref} />
			<main className="flex-1">
				<LandingHero startHref={startHref} />
				<LandingStats />
				<LandingDemo />
				<LandingHowItWorks />
				<LandingFeatures />
				<LandingLevels />
{/* <LandingPricing startHref={startHref} /> */}
				<LandingLanguages />
				<LandingFaq />
				<LandingCta startHref={startHref} loginHref={loginHref} />
			</main>
			<LandingFooter />
		</div>
	);
};
