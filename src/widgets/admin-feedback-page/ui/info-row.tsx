import { Typography } from "@/shared/ui/typography";
import { ReactNode } from "react";

interface InfoRowProps {
	label: string;
	children: ReactNode;
}

export const InfoRow = ({ label, children }: InfoRowProps) => (
	<div className="mb-2.5 flex flex-col gap-[3px] last:mb-0">
		<Typography tag="span" className="text-[10.5px] text-t-3">
			{label}
		</Typography>
		<div className="text-[12px] font-medium text-t-1">{children}</div>
	</div>
);
