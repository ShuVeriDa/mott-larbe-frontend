"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import type { Editor, SlashMenuItem } from "@/shared/ui/notion-editor";
import { Typography } from "@/shared/ui/typography";
import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Bold,
	Italic,
	List,
	ListOrdered,
	Redo,
	Strikethrough,
	Underline,
	Undo,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { createPortal } from "react-dom";
import { useAdminTextEditorToolbar } from "./model/use-admin-text-editor-toolbar";

export const TbBtn = ({
	title,
	active,
	onExec,
	children,
}: {
	title: string;
	active?: boolean;
	onExec: () => void;
	children: ReactNode;
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

export const TbDivider = () => (
	<div className="mx-0.5 h-4 w-px shrink-0 bg-bd-2" />
);

export const getSlashItems = (
	t: ReturnType<typeof useI18n>["t"],
): SlashMenuItem[] => [
	{
		title: t("admin.texts.createPage.formatText"),
		description: "Обычный абзац",
		group: "Basic blocks",
		icon: (
			<Typography tag="span" className="text-[11px] font-medium text-t-2">
				T
			</Typography>
		),
		command: editor => editor.chain().focus().setParagraph().run(),
	},
	{
		title: t("admin.texts.createPage.formatH1"),
		description: "Крупный заголовок",
		group: "Basic blocks",
		hint: "#",
		icon: (
			<Typography tag="span" className="text-[11px] font-bold text-t-2">
				H₁
			</Typography>
		),
		command: editor => editor.chain().focus().setHeading({ level: 1 }).run(),
	},
	{
		title: t("admin.texts.createPage.formatH2"),
		description: "Средний заголовок",
		group: "Basic blocks",
		hint: "##",
		icon: (
			<Typography tag="span" className="text-[11px] font-bold text-t-2">
				H₂
			</Typography>
		),
		command: editor => editor.chain().focus().setHeading({ level: 2 }).run(),
	},
	{
		title: t("admin.texts.createPage.formatH3"),
		description: "Небольшой заголовок",
		group: "Basic blocks",
		hint: "###",
		icon: (
			<Typography tag="span" className="text-[10px] font-bold text-t-2">
				H₃
			</Typography>
		),
		command: editor => editor.chain().focus().setHeading({ level: 3 }).run(),
	},
	{
		title: t("admin.texts.createPage.formatH4"),
		description: "Маленький заголовок",
		group: "Basic blocks",
		hint: "####",
		icon: (
			<Typography tag="span" className="text-[10px] font-bold text-t-2">
				H₄
			</Typography>
		),
		command: editor => editor.chain().focus().setHeading({ level: 4 }).run(),
	},
	{
		title: t("admin.texts.createPage.formatQuote"),
		description: "Цитата",
		group: "Basic blocks",
		hint: '"',
		icon: (
			<Typography tag="span" className="text-[13px] text-t-2">
				&quot;
			</Typography>
		),
		command: editor => editor.chain().focus().setBlockquote().run(),
	},
	{
		title: t("admin.texts.createPage.bulletList"),
		description: "Маркированный список",
		group: "Basic blocks",
		hint: "-",
		icon: <List className="size-3" />,
		command: editor => editor.chain().focus().toggleBulletList().run(),
	},
	{
		title: t("admin.texts.createPage.orderedList"),
		description: "Нумерованный список",
		group: "Basic blocks",
		hint: "1.",
		icon: <ListOrdered className="size-3" />,
		command: editor => editor.chain().focus().toggleOrderedList().run(),
	},
];

interface EditorToolbarProps {
	editor: Editor | null;
	t: ReturnType<typeof useI18n>["t"];
	extraItems?: ReactNode;
}

export const EditorToolbar = ({
	editor,
	t,
	extraItems,
}: EditorToolbarProps) => {
	const {
		blockTypeAnchor,
		blockTypeOpen,
		blockTypeOptions,
		currentBlockType,
		currentBlockTypeLabel,
		getHandleBlockTypeItemMouseDown,
		handleBlockTypeBackdropMouseDown,
		handleBlockTypeMouseDown,
		handleRedo,
		handleSetAlignCenter,
		handleSetAlignJustify,
		handleSetAlignLeft,
		handleSetAlignRight,
		handleToggleBold,
		handleToggleBulletList,
		handleToggleItalic,
		handleToggleOrderedList,
		handleToggleStrike,
		handleToggleUnderline,
		handleUndo,
	} = useAdminTextEditorToolbar({
		editor,
		t,
	});

	return (
		<div className="sticky top-[52px] z-10 w-full overflow-x-auto border-b border-bd-1 bg-surf px-2 py-[5px] transition-colors [scrollbar-width:none]">
			<div className="flex min-w-max items-center gap-px">
				<div className="relative shrink-0">
					<Button
						onMouseDown={handleBlockTypeMouseDown}
						className="flex h-7 items-center gap-1 rounded-[6px] px-2 text-[12px] font-medium text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 select-none"
					>
						{currentBlockTypeLabel}
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
					{blockTypeOpen &&
						blockTypeAnchor &&
						createPortal(
							<>
								<div
									className="fixed inset-0 z-9998"
									onMouseDown={handleBlockTypeBackdropMouseDown}
								/>
								<div
									className="fixed z-9999 min-w-[220px] overflow-hidden rounded-[10px] border border-bd-2 bg-surf py-1 shadow-lg flex flex-col gap-1"
									style={{
										top: blockTypeAnchor.bottom + 6,
										left: blockTypeAnchor.left,
									}}
								>
									{blockTypeOptions.map(option => {
										return (
											<Button
												key={option.value}
												onMouseDown={getHandleBlockTypeItemMouseDown(
													option.value,
												)}
												className={`flex w-[calc(100%-8px)] items-center gap-2 mx-1 rounded-[6px] px-2 py-[5px] text-left transition-colors ${
													currentBlockType === option.value
														? "bg-surf-2"
														: "hover:bg-surf-2"
												}`}
											>
												<span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-t-2">
													<Typography
														tag="span"
														className="text-[11px] font-medium text-t-2"
													>
														{option.iconLabel}
													</Typography>
												</span>
												<span className="flex-1 text-[13.5px] text-t-1">
													{option.label}
												</span>
												{option.hint && (
													<span className="text-[11px] text-t-4">
														{option.hint}
													</span>
												)}
											</Button>
										);
									})}
								</div>
							</>,
							document.body,
						)}
				</div>

				<TbDivider />

				<TbBtn
					title={t("admin.texts.createPage.bold")}
					active={editor?.isActive("bold")}
					onExec={handleToggleBold}
				>
					<Bold className="size-[13px]" />
				</TbBtn>
				<TbBtn
					title={t("admin.texts.createPage.italic")}
					active={editor?.isActive("italic")}
					onExec={handleToggleItalic}
				>
					<Italic className="size-[13px]" />
				</TbBtn>
				<TbBtn
					title={t("admin.texts.createPage.underline")}
					active={editor?.isActive("underline")}
					onExec={handleToggleUnderline}
				>
					<Underline className="size-[13px]" />
				</TbBtn>
				<TbBtn
					title="Strike"
					active={editor?.isActive("strike")}
					onExec={handleToggleStrike}
				>
					<Strikethrough className="size-[13px]" />
				</TbBtn>

				<TbDivider />

				<TbBtn
					title={t("admin.texts.createPage.bulletList")}
					active={editor?.isActive("bulletList")}
					onExec={handleToggleBulletList}
				>
					<List className="size-[13px]" />
				</TbBtn>
				<TbBtn
					title={t("admin.texts.createPage.orderedList")}
					active={editor?.isActive("orderedList")}
					onExec={handleToggleOrderedList}
				>
					<ListOrdered className="size-[13px]" />
				</TbBtn>

				<TbDivider />

				<TbBtn
					title="По левому краю"
					active={editor?.isActive({ textAlign: "left" })}
					onExec={handleSetAlignLeft}
				>
					<AlignLeft className="size-[13px]" />
				</TbBtn>
				<TbBtn
					title="По центру"
					active={editor?.isActive({ textAlign: "center" })}
					onExec={handleSetAlignCenter}
				>
					<AlignCenter className="size-[13px]" />
				</TbBtn>
				<TbBtn
					title="По правому краю"
					active={editor?.isActive({ textAlign: "right" })}
					onExec={handleSetAlignRight}
				>
					<AlignRight className="size-[13px]" />
				</TbBtn>
				<TbBtn
					title="По ширине"
					active={editor?.isActive({ textAlign: "justify" })}
					onExec={handleSetAlignJustify}
				>
					<AlignJustify className="size-[13px]" />
				</TbBtn>

				<TbDivider />

				<TbBtn title={t("admin.texts.createPage.undo")} onExec={handleUndo}>
					<Undo className="size-[13px]" />
				</TbBtn>
				<TbBtn title={t("admin.texts.createPage.redo")} onExec={handleRedo}>
					<Redo className="size-[13px]" />
				</TbBtn>

				{extraItems && (
					<>
						<TbDivider />
						{extraItems}
					</>
				)}
			</div>
		</div>
	);
};
