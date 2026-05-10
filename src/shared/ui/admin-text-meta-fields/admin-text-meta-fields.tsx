"use client";

import type { TextLevel } from "@/entities/admin-text";
import { Button } from "@/shared/ui/button";
import { Select, type SelectProps } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import type { ComponentProps, InputHTMLAttributes, ReactNode } from "react";

export const LEVELS: TextLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const levelColorMap: Record<TextLevel, string> = {
	A1: "bg-grn-muted border-grn/25 text-grn-strong",
	A2: "bg-[#d1fae5] border-[rgba(6,95,70,0.25)] text-[#065f46] dark:bg-[rgba(6,95,70,0.12)] dark:text-[#6ee7b7]",
	B1: "bg-acc-muted border-acc/25 text-acc-strong",
	B2: "bg-pur-muted border-pur/20 text-pur-strong",
	C1: "bg-amb-muted border-amb/20 text-amb-strong",
	C2: "bg-red-muted border-red/20 text-red-strong",
};

export const MetaSection = ({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) => (
	<div className="border-b border-bd-1 px-4 py-[14px]">
		<div className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.6px] text-t-3">
			{title}
		</div>
		{children}
	</div>
);

export const FieldLabel = ({ children }: { children: ReactNode }) => (
	<Typography
		tag="label"
		className="mb-1.5 block text-[11px] font-medium text-t-3"
	>
		{children}
	</Typography>
);

export const FieldInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
	<input
		{...props}
		className="h-[34px] w-full rounded-base border border-bd-2 bg-surf px-2.5 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
	/>
);

export const FieldSelect = (props: SelectProps) => (
	<Select variant="lg" className="bg-surf border" {...props} />
);

export const MetaToggle = ({
	checked,
	onChange,
}: {
	checked: boolean;
	onChange: (v: boolean) => void;
}) => {
	const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onChange(!checked);
	return (
		<Button
			role="switch"
			aria-checked={checked}
			onClick={handleClick}
			className={`relative h-[18px] w-[34px] shrink-0 rounded-full border-none p-0 transition-colors ${checked ? "bg-acc" : "bg-surf-3"}`}
		>
			<Typography
				tag="span"
				className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[16px] left-[2px]" : "translate-x-0 left-[2px]"}`}
			/>
		</Button>
	);
};
