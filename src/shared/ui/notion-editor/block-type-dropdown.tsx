"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { Editor } from "@tiptap/react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";

const BLOCK_TYPES = [
	{ value: "p", label: "Text", iconLabel: "T", hint: undefined },
	{ value: "h1", label: "Heading 1", iconLabel: "H1", hint: "#" },
	{ value: "h2", label: "Heading 2", iconLabel: "H2", hint: "##" },
	{ value: "h3", label: "Heading 3", iconLabel: "H3", hint: "###" },
	{ value: "h4", label: "Heading 4", iconLabel: "H4", hint: "####" },
	{ value: "blockquote", label: "Quote", iconLabel: "\"", hint: "\"" },
] as const;

export const BlockTypeDropdown = ({ editor }: { editor: Editor }) => {
	const [anchor, setAnchor] = useState<DOMRect | null>(null);
	const open = anchor !== null;

	const current = editor.isActive("heading", { level: 1 })
		? "h1"
		: editor.isActive("heading", { level: 2 })
			? "h2"
			: editor.isActive("heading", { level: 3 })
				? "h3"
				: editor.isActive("heading", { level: 4 })
					? "h4"
					: editor.isActive("blockquote")
						? "blockquote"
						: "p";

	const currentLabel = BLOCK_TYPES.find(b => b.value === current)?.label ?? "Text";

	const apply = (v: string) => {
		if (v === "p") editor.chain().focus().setParagraph().run();
		else if (v === "h1") editor.chain().focus().setHeading({ level: 1 }).run();
		else if (v === "h2") editor.chain().focus().setHeading({ level: 2 }).run();
		else if (v === "h3") editor.chain().focus().setHeading({ level: 3 }).run();
		else if (v === "h4") editor.chain().focus().setHeading({ level: 4 }).run();
		else if (v === "blockquote") editor.chain().focus().setBlockquote().run();
		setAnchor(null);
	};

	const handleMouseDown: NonNullable<
		ComponentProps<"button">["onMouseDown"]
	> = e => {
		e.preventDefault();
		const rect = e.currentTarget.getBoundingClientRect();
		setAnchor(prev => (prev ? null : rect));
	};
	const handleBackdropMouseDown: NonNullable<
		ComponentProps<"div">["onMouseDown"]
	> = () => setAnchor(null);

	return (
		<div className="relative">
			<Button
				onMouseDown={handleMouseDown}
				className="flex h-7 items-center gap-1 rounded-[6px] px-2 text-[12px] font-medium text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 select-none"
			>
				{currentLabel}
				<svg
					width="10"
					height="6"
					viewBox="0 0 10 6"
					fill="none"
					className="opacity-50"
				>
					<path
						d="M1 1l4 4 4-4"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</Button>
			{open &&
				anchor &&
				createPortal(
					<>
						<div
							className="fixed inset-0 z-9998"
							onMouseDown={handleBackdropMouseDown}
						/>
						<div
							className="fixed z-9999 min-w-[220px] overflow-hidden rounded-[10px] border border-bd-2 bg-surf py-1 shadow-lg flex flex-col gap-1"
							style={{ top: anchor.bottom + 6, left: anchor.left }}
						>
							{BLOCK_TYPES.map(b => {
								const handleItemMouseDown: NonNullable<
									ComponentProps<"button">["onMouseDown"]
								> = e => {
									e.preventDefault();
									apply(b.value);
								};
								return (
									<Button
										key={b.value}
										onMouseDown={handleItemMouseDown}
										className={`flex w-[calc(100%-8px)] items-center gap-2 mx-1 rounded-[6px] px-2 py-[5px] text-left transition-colors ${
											current === b.value ? "bg-surf-2" : "hover:bg-surf-2"
										}`}
									>
										<span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-t-2">
											<Typography
												tag="span"
												className="text-[11px] font-medium text-t-2"
											>
												{b.iconLabel}
											</Typography>
										</span>
										<span className="flex-1 text-[13.5px] text-t-1">{b.label}</span>
										{b.hint && (
											<span className="text-[11px] text-t-4">{b.hint}</span>
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
