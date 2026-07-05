import { Typography } from "@/shared/ui/typography";

import type { PwaGuideContent } from "../model/types";
import { PwaGuideAndroidSection } from "./pwa-guide-android-section";
import { PwaGuideBenefitsSection } from "./pwa-guide-benefits-section";
import { PwaGuideDesktopSection } from "./pwa-guide-desktop-section";
import { PwaGuideIosSection } from "./pwa-guide-ios-section";
import { PwaGuideTabs } from "./pwa-guide-tabs";

interface PwaInstallGuidePageProps {
	content: PwaGuideContent;
}

export const PwaInstallGuidePage = ({ content }: PwaInstallGuidePageProps) => (
	<main className="h-full overflow-y-auto bg-panel">
		<div className="mx-auto max-w-3xl px-4 py-8 pb-20 sm:px-6 lg:px-8">
			<Typography tag="h1" size="2xl" className="mb-6 font-bold text-t-1">
				{content.pageTitle}
			</Typography>

			<PwaGuideTabs
				labels={content.tabs}
				content={{
					ios: <PwaGuideIosSection cta={content.iosCta} steps={content.iosSteps} />,
					android: (
						<PwaGuideAndroidSection title={content.tabs.android} steps={content.androidSteps} />
					),
					desktop: (
						<PwaGuideDesktopSection title={content.tabs.desktop} steps={content.desktopSteps} />
					),
				}}
			/>

			<div className="mt-8">
				<PwaGuideBenefitsSection benefits={content.benefits} />
			</div>
		</div>
	</main>
);
