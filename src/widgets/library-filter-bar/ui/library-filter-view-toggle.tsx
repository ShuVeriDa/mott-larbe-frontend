"use client";

import type { LibraryView } from "@/features/library-filters";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import type { ComponentType, ReactNode } from "react";
import { Grid2x2, List } from "lucide-react";

const VIEW_TOGGLE_ENTRIES: ReadonlyArray<{
	view: LibraryView;
	labelKey: "library.view.grid" | "library.view.list";
	Icon: ComponentType<{ size?: number }>;
}> = [
	{ view: "grid", labelKey: "library.view.grid", Icon: Grid2x2 },
	{ view: "list", labelKey: "library.view.list", Icon: List },
];

export interface LibraryFilterViewToggleProps {
	view: LibraryView;
	onViewChange: (view: LibraryView) => void;
	t: (key: string) => string;
}

export const LibraryFilterViewToggle = ({
	view,
	onViewChange,
	t,
}: LibraryFilterViewToggleProps) => (
	<div className="flex shrink-0 overflow-hidden rounded-base border border-bd-2 max-sm:hidden">
		{VIEW_TOGGLE_ENTRIES.map(({ view: mode, labelKey, Icon }) => {
			const handleClick = () => onViewChange(mode);
			return (
				<ViewBtn
					key={mode}
					active={view === mode}
					onClick={handleClick}
					aria-label={t(labelKey)}
				>
					<Icon size={16} />
				</ViewBtn>
			);
		})}
	</div>
);

const ViewBtn = ({
	children,
	active,
	onClick,
	"aria-label": ariaLabel,
}: {
	children: ReactNode;
	active: boolean;
	onClick: () => void;
	"aria-label": string;
}) => (
	<Button
		onClick={onClick}
		size={"bare"}
		aria-label={ariaLabel}
		aria-pressed={active}
		className={cn(
			"flex h-[26px] w-[26px] items-center justify-center transition-all duration-100",
			active ? "bg-surf-2 text-acc-t" : "bg-transparent text-t-3",
		)}
	>
		{children}
	</Button>
);
