"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { Editor } from "@tiptap/react";
import { Bold, Code, Italic, Strikethrough, Underline } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BlockTypeDropdown } from "./block-type-dropdown";
import { BG_COLORS, ColorPanel, TEXT_COLORS } from "./color-panel";

const Sep = () => <div className="mx-1 h-[18px] w-px shrink-0 bg-bd-2" />;

const Btn = ({
	active,
	onExec,
	title,
	children,
	wide,
}: {
	active?: boolean;
	onExec: () => void;
	title: string;
	children: ReactNode;
	wide?: boolean;
}) => {
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
			className={`flex shrink-0 items-center justify-center gap-1 rounded-[6px] text-[12px] font-medium transition-all duration-100 select-none
				${wide ? "h-7 px-2" : "h-7 w-7"}
				${
					active
						? "bg-[#2783de]/10 text-[#2783de]"
						: "text-t-2 hover:bg-surf-3 hover:text-t-1 active:scale-95"
				}`}
		>
			{children}
		</Button>
	);
};

export const BubbleMenuContent = ({
	editor,
	extraToolbarItems,
}: {
	editor: Editor;
	extraToolbarItems?: ReactNode;
}) => {
	const [colorOpen, setColorOpen] = useState(false);
	const [colorAnchor, setColorAnchor] = useState<DOMRect | null>(null);
	const colorBtnRef = useRef<HTMLButtonElement>(null);

	const activeTextColor = TEXT_COLORS.find(
		c => c.value && editor.isActive("textStyle", { color: c.value }),
	);
	const activeHighlight = BG_COLORS.find(
		c => c.value && editor.isActive("highlight", { color: c.value }),
	);

	const toggleColor = () => {
		const rect = colorBtnRef.current?.getBoundingClientRect() ?? null;
		setColorAnchor(rect);
		setColorOpen(v => !v);
	};

	const handleBold = () => editor.chain().focus().toggleBold().run();
	const handleItalic = () => editor.chain().focus().toggleItalic().run();
	const handleUnderline = () => editor.chain().focus().toggleUnderline().run();
	const handleStrike = () => editor.chain().focus().toggleStrike().run();
	const handleCode = () => editor.chain().focus().toggleCode().run();
	const handleColorMouseDown: NonNullable<
		ComponentProps<"button">["onMouseDown"]
	> = e => {
		e.preventDefault();
		toggleColor();
	};
	const handleBackdropMouseDown: NonNullable<
		ComponentProps<"div">["onMouseDown"]
	> = () => setColorOpen(false);
	const handleColorClose = () => setColorOpen(false);

	return (
		<>
			<div className="flex items-center gap-0.5 rounded-[11px] border border-bd-2 bg-surf px-1.5 py-1.5 shadow-lg backdrop-blur-sm">
				<BlockTypeDropdown editor={editor} />
				<Sep />
				<Btn title="Bold" active={editor.isActive("bold")} onExec={handleBold}>
					<Bold className="size-[13px]" />
				</Btn>
				<Btn
					title="Italic"
					active={editor.isActive("italic")}
					onExec={handleItalic}
				>
					<Italic className="size-[11px]" />
				</Btn>
				<Btn
					title="Underline"
					active={editor.isActive("underline")}
					onExec={handleUnderline}
				>
					<Underline className="size-[13px]" />
				</Btn>
				<Btn
					title="Strikethrough"
					active={editor.isActive("strike")}
					onExec={handleStrike}
				>
					<Strikethrough className="size-[13px]" />
				</Btn>
				<Btn title="Code" active={editor.isActive("code")} onExec={handleCode}>
					<Code className="size-[13px]" />
				</Btn>
				<Sep />
				<Button
					ref={colorBtnRef}
					title="Color"
					onMouseDown={handleColorMouseDown}
					className={`flex h-7 w-8 shrink-0 flex-col items-center justify-center gap-px rounded-[6px] transition-all select-none
						${colorOpen ? "bg-acc text-white" : "text-t-2 hover:bg-surf-3 hover:text-t-1 active:scale-95"}`}
				>
					<Typography tag="span" className="text-[13px] font-bold leading-none">
						A
					</Typography>
					<Typography
						tag="span"
						className="h-[3px] w-[14px] rounded-full transition-colors"
						style={{
							background: colorOpen
								? "white"
								: (activeTextColor?.value ??
									activeHighlight?.value ??
									"var(--t-3)"),
						}}
					/>
				</Button>
				{extraToolbarItems && (
					<>
						<Sep />
						{extraToolbarItems}
					</>
				)}
			</div>

			{colorOpen &&
				colorAnchor &&
				createPortal(
					<>
						<div
							className="fixed inset-0 z-[9998]"
							onMouseDown={handleBackdropMouseDown}
						/>
						<div
							className="fixed z-[9999]"
							style={{ top: colorAnchor.bottom + 6, left: colorAnchor.left }}
						>
							<ColorPanel editor={editor} onClose={handleColorClose} />
						</div>
					</>,
					document.body,
				)}
		</>
	);
};
