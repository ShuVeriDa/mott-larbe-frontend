import type { ReactNode } from "react";
import { SectionLabel } from "@/shared/ui/section-label";

export const MetaSection = ({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) => (
	<div className="border-b border-bd-1 px-4 py-[14px]">
		<SectionLabel className="mb-3">
			{title}
		</SectionLabel>
		{children}
	</div>
);
