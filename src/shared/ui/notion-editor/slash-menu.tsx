"use client";

import { Button } from "@/shared/ui/button";

import type { Editor } from "@tiptap/react";
import {
	type ReactNode,
	type Ref,
} from "react";
import { useSlashMenu } from "./use-slash-menu";
export interface SlashMenuItem {
	title: string;
	description: string;
	icon: ReactNode;
	command: (editor: Editor) => void;
}

interface SlashMenuProps {
	items: SlashMenuItem[];
	command: (item: SlashMenuItem) => void;
	ref?: Ref<SlashMenuHandle>;
}

export interface SlashMenuHandle {
	onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const SlashMenu = ({ items, command, ref }: SlashMenuProps) => {
	const { selectedIndex, handleItemMouseDown } = useSlashMenu({
		items,
		command,
		ref,
	});

	if (!items.length) return null;

	return (
		<div className="z-50 min-w-[220px] overflow-hidden rounded-[10px] border border-bd-2 bg-bg p-1 shadow-lg">
			{items.map((item, i) => {
				return (
					<Button
						key={i}
						data-index={i}
						onMouseDown={handleItemMouseDown}
						className={`flex w-full items-center gap-3 rounded-base px-2.5 py-2 text-left transition-colors ${
							i === selectedIndex ? "bg-surf-2" : "hover:bg-surf-2"
						}`}
					>
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-bd-2 bg-surf text-t-2">
							{item.icon}
						</div>
						<div className="min-w-0">
							<div className="text-[13px] font-medium text-t-1">
								{item.title}
							</div>
							<div className="truncate text-[11px] text-t-3">
								{item.description}
							</div>
						</div>
					</Button>
				);
			})}
		</div>
	);
};

SlashMenu.displayName = "SlashMenu";
