import { Typography } from "@/shared/ui/typography";
import type { ReactNode } from "react";

export const FieldLabel = ({ children }: { children: ReactNode }) => (
	<Typography
		tag="label"
		className="mb-1.5 block text-[11px] font-medium text-t-3"
	>
		{children}
	</Typography>
);
