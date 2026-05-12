import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import type { ReactNode } from "react";

interface UserMenuInlineRowProps {
	icon: ReactNode;
	label: string;
	onItemSelect: (e: Event) => void;
	children: ReactNode;
}

export const UserMenuInlineRow = ({
	icon,
	label,
	onItemSelect,
	children,
}: UserMenuInlineRowProps) => (
	<div className="border-t border-bd-1">
		<DropdownMenuPrimitive.Item
			onSelect={onItemSelect}
			className="flex items-center justify-between gap-3 px-3 py-2 focus-visible:outline-none cursor-default"
		>
			<div className="flex items-center gap-2.5 text-[12.5px] text-t-2 shrink-0">
				{icon}
				{label}
			</div>
			<div
				role="radiogroup"
				aria-label={label}
				className="flex rounded-full border border-bd-1 bg-surf-2 p-0.5 gap-px"
			>
				{children}
			</div>
		</DropdownMenuPrimitive.Item>
	</div>
);
