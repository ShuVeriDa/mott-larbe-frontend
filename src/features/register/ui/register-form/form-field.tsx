"use client";

import { AlertCircle } from "lucide-react";
import { Typography } from "@/shared/ui/typography";
import { ReactNode } from "react";

interface Props {
	label: string;
	error?: string;
	children: ReactNode;
}

export const FormField = ({ label, error, children }: Props) => (
	<div>
		<Typography
			tag="label"
			className="mb-1.5 block text-[11.5px] font-medium text-t-2"
		>
			{label}
		</Typography>
		{children}
		{error ? (
			<Typography className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-red">
				<AlertCircle size={12} strokeWidth={2} />
				<Typography tag="span">{error}</Typography>
			</Typography>
		) : null}
	</div>
);
