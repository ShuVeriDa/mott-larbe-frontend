import { cn } from "@/shared/lib/cn";
import type { FeatureFlagCategory } from "@/entities/feature-flag";

interface FlagCategoryBadgeProps {
	category: FeatureFlagCategory;
	t: (key: string) => string;
}

const CATEGORY_STYLES: Record<FeatureFlagCategory, string> = {
	FUNCTIONAL: "bg-acc-bg text-acc-t",
	EXPERIMENTS: "bg-pur-bg text-pur-t",
	TECHNICAL: "bg-surf-3 text-t-2",
	MONETIZATION: "bg-amb-bg text-amb-t",
};

export const FlagCategoryBadge = ({ category, t }: FlagCategoryBadgeProps) => (
	<span
		className={cn(
			"inline-flex items-center gap-1 rounded-full px-1.5 py-[2px] text-[11px] font-medium",
			CATEGORY_STYLES[category],
		)}
	>
		{t(`admin.featureFlags.category.${category}`)}
	</span>
);
