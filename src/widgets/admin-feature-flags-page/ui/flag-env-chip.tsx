import { cn } from "@/shared/lib/cn";
import type { FeatureFlagEnvironment } from "@/entities/feature-flag";

interface FlagEnvChipProps {
	env: FeatureFlagEnvironment;
}

const ENV_STYLES: Record<FeatureFlagEnvironment, string> = {
	PROD: "border-red-200 bg-red-bg text-red-t dark:border-red-900/30",
	STAGE: "border-amb-200 bg-amb-bg text-amb-t dark:border-amber-900/30",
	DEV: "border-grn-200 bg-grn-bg text-grn-t dark:border-green-900/30",
};

export const FlagEnvChip = ({ env }: FlagEnvChipProps) => (
	<span
		className={cn(
			"rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2px] border",
			ENV_STYLES[env],
		)}
	>
		{env}
	</span>
);
