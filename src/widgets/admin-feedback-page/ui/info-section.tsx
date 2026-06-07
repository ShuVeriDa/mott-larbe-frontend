import { Typography } from "@/shared/ui/typography";
import { ReactNode } from "react";

interface InfoSectionProps {
	title: string;
	children: ReactNode;
}

export const InfoSection = ({ title, children }: InfoSectionProps) => (
	<div className="border-b border-bd-1 px-4 py-3.5">
		<Typography
			tag="h3"
			className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3"
		>
			{title}
		</Typography>
		{children}
	</div>
);
