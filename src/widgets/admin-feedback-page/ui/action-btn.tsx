import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import { ReactNode } from "react";

interface ActionBtnProps {
	children: ReactNode;
	icon: ReactNode;
	onClick: () => void;
	className: string;
	title?: string;
}

export const ActionBtn = ({ children, icon, onClick, className, title }: ActionBtnProps) => (
	<Button
		onClick={onClick}
		title={title}
		className={cn(
			"flex h-[30px] w-full items-center justify-center gap-1.5 rounded-base border text-[12px] font-semibold transition-opacity",
			className,
		)}
	>
		{icon}
		{children}
	</Button>
);
