"use client";

import { Button } from "@/shared/ui/button";

import type { Editor } from "@tiptap/react";
import { type ReactNode, type Ref } from "react";
import { useSlashMenu } from "./use-slash-menu";
export interface SlashMenuItem {
	title: string;
	description: string;
	icon: ReactNode;
	command: (editor: Editor) => void;
	group?: string;
	hint?: string;
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
		<div className="z-50 min-w-[220px] overflow-hidden rounded-[10px] border border-bd-2 bg-surf py-1 shadow-lg flex flex-col gap-1">
			{items.map((item, i) => {
				const isFirstInGroup = i === 0 || items[i - 1].group !== item.group;
				return (
					<div key={i}>
						{item.group && isFirstInGroup && (
							<div
								className={`px-3 pb-1 text-[11px] font-medium text-t-3 ${i === 0 ? "pt-1" : "pt-2"}`}
							>
								{item.group}
							</div>
						)}
						<Button
							data-index={i}
							onMouseDown={handleItemMouseDown}
							className={`flex w-[calc(100%-8px)] items-center gap-2 mx-1 rounded-[6px] px-2 py-[5px] text-left transition-colors ${
								i === selectedIndex ? "bg-surf-2" : "hover:bg-surf-2"
							}`}
						>
							<span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-t-2">
								{item.icon}
							</span>
							<span className="flex-1 text-[13.5px] text-t-1">
								{item.title}
							</span>
							{item.hint && (
								<span className="text-[11px] text-t-4">{item.hint}</span>
							)}
						</Button>
					</div>
				);
			})}
		</div>
	);
};

SlashMenu.displayName = "SlashMenu";
