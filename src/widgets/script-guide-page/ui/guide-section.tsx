import type { ReactNode } from "react";
import { Typography } from "@/shared/ui/typography";

interface GuideSectionProps {
	id: string;
	title: string;
	description?: string;
	children: ReactNode;
}

export const GuideSection = ({ id, title, description, children }: GuideSectionProps) => (
	<section id={id} className="scroll-mt-6 mb-10">
		<div className="mb-3 flex items-center gap-3">
			<div className="h-px flex-1 bg-bd-1" />
			<Typography tag="h2" size="sm" className="font-semibold uppercase tracking-wide text-t-3">
				{title}
			</Typography>
			<div className="h-px flex-1 bg-bd-1" />
		</div>
		{description && (
			<Typography tag="p" className="mb-3 text-sm text-t-3">
				{description}
			</Typography>
		)}
		{children}
	</section>
);
