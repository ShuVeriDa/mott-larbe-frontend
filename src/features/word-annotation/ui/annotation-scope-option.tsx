"use client";

import { CheckIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface AnnotationScopeOptionProps {
	active: boolean;
	label: string;
	description: string;
	onClick: () => void;
}

export const AnnotationScopeOption = ({
	active,
	label,
	description,
	onClick,
}: AnnotationScopeOptionProps) => {
	const handleClick = () => onClick();

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"flex w-full items-start gap-3 rounded-base border border-hairline p-3 text-left transition-colors",
				active
					? "border-acc bg-acc/5"
					: "border-bd-1 bg-surf-2 hover:border-bd-2 hover:bg-surf-3",
			)}
		>
			<div
				className={cn(
					"mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
					active ? "border-acc bg-acc" : "border-bd-2",
				)}
			>
				{active && (
					<CheckIcon className="size-2.5 text-white" strokeWidth={3} />
				)}
			</div>
			<div>
				<div className="text-[13px] font-medium text-t-1">{label}</div>
				<div className="mt-0.5 text-[11px] text-t-3">{description}</div>
			</div>
		</button>
	);
};
