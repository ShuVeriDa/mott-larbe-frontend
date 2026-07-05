import { PwaInstallStep } from "@/entities/pwa-install";
import type { LucideIcon } from "lucide-react";

import type { PwaGuideStepsText } from "../model/types";

interface PwaGuideStepsListProps {
	icons: [LucideIcon, LucideIcon, LucideIcon];
	steps: PwaGuideStepsText;
}

export const PwaGuideStepsList = ({ icons, steps }: PwaGuideStepsListProps) => (
	<div className="flex flex-col gap-4">
		<PwaInstallStep step={1} icon={icons[0]} text={steps.step1} />
		<PwaInstallStep step={2} icon={icons[1]} text={steps.step2} />
		<PwaInstallStep step={3} icon={icons[2]} text={steps.step3} />
	</div>
);
