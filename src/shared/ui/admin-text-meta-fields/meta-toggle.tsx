"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { ComponentProps } from "react";

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
			title={checked ? "On" : "Off"}
			className={`relative h-[18px] w-[34px] shrink-0 rounded-full border-none p-0 transition-colors ${checked ? "bg-acc" : "bg-surf-3"}`}
		>
			<Typography
				tag="span"
				className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[16px] left-[2px]" : "translate-x-0 left-[2px]"}`}
			/>
		</Button>
	);
};
