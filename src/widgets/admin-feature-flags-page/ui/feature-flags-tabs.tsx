import { cn } from "@/shared/lib/cn";
import type { FeatureFlagsTab } from "../model/use-admin-feature-flags-page";

interface FeatureFlagsTabsProps {
	active: FeatureFlagsTab;
	onChange: (tab: FeatureFlagsTab) => void;
	t: (key: string) => string;
}

const TABS: FeatureFlagsTab[] = ["flags", "overrides", "history"];

export const FeatureFlagsTabs = ({ active, onChange, t }: FeatureFlagsTabsProps) => (
	<div className="mb-4 flex w-fit items-center gap-0.5 rounded-[9px] border border-bd-1 bg-surf-2 p-[3px]">
		{TABS.map((tab) => (
			<button
				key={tab}
				type="button"
				onClick={() => onChange(tab)}
				className={cn(
					"rounded-[6px] px-3.5 py-[5px] text-[12.5px] font-medium transition-all",
					active === tab
						? "bg-surf text-t-1 shadow-[0_1px_3px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.04)]"
						: "text-t-3 hover:text-t-2",
				)}
			>
				{t(`admin.featureFlags.tabs.${tab}`)}
			</button>
		))}
	</div>
);
