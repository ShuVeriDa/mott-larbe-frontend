import type { LucideIcon } from "lucide-react";

interface PwaInstallStepProps {
	step: number;
	icon: LucideIcon;
	text: string;
}

export const PwaInstallStep = ({ step, icon: Icon, text }: PwaInstallStepProps) => (
	<div className="flex items-center gap-3">
		<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surf-2 text-t-2">
			<Icon className="h-4 w-4" aria-hidden="true" />
		</span>
		<p className="text-sm text-t-1">
			<span className="mr-1 font-semibold">{step}.</span>
			{text}
		</p>
	</div>
);
