import { Typography } from "@/shared/ui/typography";

import { ANDROID_STEP_ICONS } from "../lib/pwa-guide-content";
import type { PwaGuideStepsText } from "../model/types";
import { PwaGuideStepsList } from "./pwa-guide-steps-list";

interface PwaGuideAndroidSectionProps {
	title: string;
	steps: PwaGuideStepsText;
}

export const PwaGuideAndroidSection = ({ title, steps }: PwaGuideAndroidSectionProps) => (
	<section aria-labelledby="pwa-guide-android-title" className="flex flex-col gap-4">
		<Typography
			tag="h2"
			id="pwa-guide-android-title"
			size="lg"
			className="font-semibold text-t-1"
		>
			{title}
		</Typography>
		<PwaGuideStepsList icons={ANDROID_STEP_ICONS} steps={steps} />
	</section>
);
