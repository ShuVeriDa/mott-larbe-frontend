import type { ReactNode } from "react";
import { Typography } from "@/shared/ui/typography";

interface AdminTopbarProps {
	title: string;
	subtitle?: string;
	isLoading?: boolean;
	children?: ReactNode;
}

export const AdminTopbar = ({ title, subtitle, isLoading, children }: AdminTopbarProps) => (
	<header className="flex shrink-0 items-center gap-3 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3">
		<div>
			<Typography tag="h1" className="font-display text-[16px] font-medium text-t-1">
				{title}
			</Typography>
			{subtitle !== undefined && (
				<Typography tag="p" className="mt-px text-[12px] text-t-3">
					{isLoading ? "…" : subtitle}
				</Typography>
			)}
		</div>
		{children && <div className="ml-auto flex items-center gap-2">{children}</div>}
	</header>
);
