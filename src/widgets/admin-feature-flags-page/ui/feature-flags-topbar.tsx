import type { ReactNode } from 'react';
import { Typography } from "@/shared/ui/typography";
interface FeatureFlagsTopbarProps {
	title: string;
	subtitle: string;
	actions: ReactNode;
}

export const FeatureFlagsTopbar = ({
	title,
	subtitle,
	actions,
}: FeatureFlagsTopbarProps) => (
	<header className=" flex items-center gap-3 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3">
		<div>
			<Typography tag="h1" className="font-display text-[16px] font-medium text-t-1">{title}</Typography>
			<Typography tag="p" className="mt-px text-[12px] text-t-3">{subtitle}</Typography>
		</div>
		<div className="ml-auto flex items-center gap-2">{actions}</div>
	</header>
);
