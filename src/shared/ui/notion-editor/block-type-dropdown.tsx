"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { Editor } from "@tiptap/react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";

const BLOCK_TYPES = [
	{ value: "p",          label: "Text",      shortLabel: "Text" },
	{ value: "h1",         label: "Heading 1", shortLabel: "H1" },
	{ value: "h2",         label: "Heading 2", shortLabel: "H2" },
	{ value: "h3",         label: "Heading 3", shortLabel: "H3" },
	{ value: "h4",         label: "Heading 4", shortLabel: "H4" },
	{ value: "blockquote", label: "Quote",     shortLabel: "Quote" },
] as const;

export const BlockTypeDropdown = ({ editor }: { editor: Editor }) => {
	const [anchor, setAnchor] = useState<DOMRect | null>(null);
	const open = anchor !== null;

	const current =
		editor.isActive("heading", { level: 1 }) ? "h1" :
		editor.isActive("heading", { level: 2 }) ? "h2" :
		editor.isActive("heading", { level: 3 }) ? "h3" :
		editor.isActive("heading", { level: 4 }) ? "h4" :
		editor.isActive("blockquote") ? "blockquote" : "p";

	const currentLabel = BLOCK_TYPES.find(b => b.value === current)?.shortLabel ?? "Text";

	const apply = (v: string) => {
		if (v === "p") editor.chain().focus().setParagraph().run();
		else if (v === "h1") editor.chain().focus().setHeading({ level: 1 }).run();
		else if (v === "h2") editor.chain().focus().setHeading({ level: 2 }).run();
		else if (v === "h3") editor.chain().focus().setHeading({ level: 3 }).run();
		else if (v === "h4") editor.chain().focus().setHeading({ level: 4 }).run();
		else if (v === "blockquote") editor.chain().focus().setBlockquote().run();
		setAnchor(null);
	};

	const handleMouseDown: NonNullable<ComponentProps<"button">["onMouseDown"]> = e => {
		e.preventDefault();
		const rect = e.currentTarget.getBoundingClientRect();
		setAnchor(prev => prev ? null : rect);
	};
	const handleBackdropMouseDown: NonNullable<ComponentProps<"div">["onMouseDown"]> = () => setAnchor(null);

	return (
		<div className="relative">
			<Button
				onMouseDown={handleMouseDown}
				className="flex h-7 items-center gap-1 rounded-[6px] px-2 text-[12px] font-medium text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1 select-none"
			>
				{currentLabel}
				<svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="opacity-50">
					<path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</Button>
			{open && anchor && createPortal(
				<>
					<div className="fixed inset-0 z-[9998]" onMouseDown={handleBackdropMouseDown} />
					<div
						className="fixed z-[9999] min-w-[140px] overflow-hidden rounded-[10px] border border-bd-2 bg-surf p-1 shadow-lg"
						style={{ top: anchor.bottom + 6, left: anchor.left }}
					>
						{BLOCK_TYPES.map(b => {
							const handleItemMouseDown: NonNullable<ComponentProps<"button">["onMouseDown"]> = e => {
								e.preventDefault();
								apply(b.value);
							};
							return (
								<Button
									key={b.value}
									onMouseDown={handleItemMouseDown}
									className={`flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-1.5 text-left text-[12.5px] transition-colors
										${current === b.value ? "bg-acc-muted text-acc-strong font-medium" : "text-t-1 hover:bg-surf-2"}`}
								>
									<Typography tag="span" className="w-6 text-center text-[11px] font-semibold text-t-3">
										{b.shortLabel}
									</Typography>
									{b.label}
									{current === b.value && (
										<svg className="ml-auto" width="12" height="12" viewBox="0 0 12 12" fill="none">
											<path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									)}
								</Button>
							);
						})}
					</div>
				</>,
				document.body,
			)}
		</div>
	);
};
