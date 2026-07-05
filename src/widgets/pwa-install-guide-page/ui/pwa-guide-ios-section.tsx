import { Typography } from "@/shared/ui/typography";

import { IOS_STEP_ICONS } from "../lib/pwa-guide-content";
import type { PwaGuideStepsText } from "../model/types";
import { PwaGuideStepsList } from "./pwa-guide-steps-list";

interface PwaGuideIosSectionProps {
	cta: string;
	steps: PwaGuideStepsText;
}

export const PwaGuideIosSection = ({ cta, steps }: PwaGuideIosSectionProps) => (
	<section aria-labelledby="pwa-guide-ios-title" className="flex flex-col gap-4">
		<Typography tag="h2" id="pwa-guide-ios-title" size="lg" className="font-semibold text-t-1">
			{cta}
		</Typography>
		<PwaGuideStepsList icons={IOS_STEP_ICONS} steps={steps} />
	</section>
);
