import type { ReactNode } from 'react';
import { Typography } from "@/shared/ui/typography";

export interface ExportRowProps {
	label: string;
	description: string;
	actions: ReactNode;
}

export const ExportRow = ({ label, description, actions }: ExportRowProps) => (
	<div className="flex items-center justify-between gap-3 border-hairline border-b border-bd-1 px-4 py-3 last:border-b-0 max-sm:flex-col max-sm:items-start max-sm:gap-2.5">
		<div className="flex-1">
			<Typography tag="p" className="text-[12.5px] font-medium text-t-1">
				{label}
			</Typography>
			<Typography tag="p" className="text-[11.5px] text-t-3">
				{description}
			</Typography>
		</div>
		<div className="flex shrink-0 gap-1.5 max-sm:w-full">{actions}</div>
	</div>
);
