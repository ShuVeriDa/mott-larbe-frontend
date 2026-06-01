"use client";

import type { LibraryView } from "@/features/library-filters";
import type { ComponentType } from "react";
import { Grid2x2, List } from "lucide-react";
import { ViewBtn } from "./view-btn";

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
	<div className="flex shrink-0 overflow-hidden rounded-base border border-bd-2">
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
