import { SectionLabel } from "@/shared/ui/section-label";
import { ReactNode } from "react";

interface InfoSectionProps {
	title: string;
	children: ReactNode;
}

export const InfoSection = ({ title, children }: InfoSectionProps) => (
	<div className="border-b border-bd-1 px-4 py-3.5">
		<SectionLabel className="mb-2.5">
			{title}
		</SectionLabel>
		{children}
	</div>
);
