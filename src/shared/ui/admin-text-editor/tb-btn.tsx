"use client";

import { Button } from "@/shared/ui/button";
import { type ComponentProps, type ReactNode } from "react";

interface TbBtnProps {
	title: string;
	active?: boolean;
	onExec: () => void;
	children: ReactNode;
}

export const TbBtn = ({ title, active, onExec, children }: TbBtnProps) => {
	const handleMouseDown: NonNullable<
		ComponentProps<"button">["onMouseDown"]
	> = e => {
		e.preventDefault();
		onExec();
	};
	return (
		<Button
			size="bare"
			title={title}
			onMouseDown={handleMouseDown}
			className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[5px] transition-all duration-100 ${
				active
					? "bg-[#2783de]/10 text-[#2783de]"
					: "text-t-2 hover:bg-surf-2 hover:text-t-1 active:scale-95"
			}`}
		>
			{children}
		</Button>
	);
};
