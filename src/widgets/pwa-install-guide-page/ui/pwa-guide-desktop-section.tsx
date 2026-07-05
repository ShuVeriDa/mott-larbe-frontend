import { Typography } from "@/shared/ui/typography";

import { DESKTOP_STEP_ICONS } from "../lib/pwa-guide-content";
import type { PwaGuideStepsText } from "../model/types";
import { PwaGuideStepsList } from "./pwa-guide-steps-list";

interface PwaGuideDesktopSectionProps {
	title: string;
	steps: PwaGuideStepsText;
}

export const PwaGuideDesktopSection = ({ title, steps }: PwaGuideDesktopSectionProps) => (
	<section aria-labelledby="pwa-guide-desktop-title" className="flex flex-col gap-4">
		<Typography
			tag="h2"
			id="pwa-guide-desktop-title"
			size="lg"
			className="font-semibold text-t-1"
		>
			{title}
		</Typography>
		<PwaGuideStepsList icons={DESKTOP_STEP_ICONS} steps={steps} />
	</section>
);
