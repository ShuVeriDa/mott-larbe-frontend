"use client";

import { useI18n } from "@/shared/lib/i18n";
import { AddToDictionaryForm } from "@/features/spelling-correction";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { spring, variants } from "@/shared/lib/animation";
import type { Editor } from "@tiptap/react";
import {
	Bold,
	Code,
	Italic,
	Languages,
	Link2,
	Pencil,
	SpellCheck,
	Strikethrough,
	Subscript,
	Superscript,
	Trash2,
	Underline,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BlockTypeDropdown } from "./block-type-dropdown";
import { BG_COLORS, ColorPanel, TEXT_COLORS } from "./color-panel";

const HEADING_FONT_WEIGHTS: { label: string; value: string | null; cssValue: number }[] = [
	{ label: "300", value: "300", cssValue: 300 },
	{ label: "400", value: "400", cssValue: 400 },
	{ label: "500", value: "500", cssValue: 500 },
	{ label: "600", value: "600", cssValue: 600 },
	{ label: "700", value: "700", cssValue: 700 },
	{ label: "800", value: "800", cssValue: 800 },
];

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
	showStressMark = false,
	showSpellingAdd = false,
	extraToolbarItems,
	onEditPhrase,
	onDeletePhrase,
	onEditAnnotation,
	onDeleteAnnotation,
}: {
	editor: Editor;
	showStressMark?: boolean;
	showSpellingAdd?: boolean;
	extraToolbarItems?: ReactNode;
	onEditPhrase?: () => void;
	onDeletePhrase?: () => void;
	onEditAnnotation?: () => void;
	onDeleteAnnotation?: () => void;
}) => {
	const { t } = useI18n();
	const [colorOpen, setColorOpen] = useState(false);
	const [colorAnchor, setColorAnchor] = useState<DOMRect | null>(null);
	const colorBtnRef = useRef<HTMLButtonElement>(null);
	const [spellingFormOpen, setSpellingFormOpen] = useState(false);
	const spellingSelectionRef = useRef<{ from: number; to: number } | null>(null);

	const selectedText = editor.state.doc
		.textBetween(editor.state.selection.from, editor.state.selection.to, " ")
		.trim();

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

	const isHeading =
		editor.isActive("heading", { level: 1 }) ||
		editor.isActive("heading", { level: 2 }) ||
		editor.isActive("heading", { level: 3 }) ||
		editor.isActive("heading", { level: 4 });
	const activeHeadingFontWeight =
		(editor.getAttributes("heading").fontWeight as string | null | undefined) ?? null;

	const handleOpenSpellingForm = () => {
		spellingSelectionRef.current = {
			from: editor.state.selection.from,
			to: editor.state.selection.to,
		};
		setSpellingFormOpen(true);
	};
	const handleCloseSpellingForm = () => setSpellingFormOpen(false);

	const handleBold = () => editor.chain().focus().toggleBold().run();
	const handleItalic = () => editor.chain().focus().toggleItalic().run();
	const handleUnderline = () => editor.chain().focus().toggleUnderline().run();
	const handleStrike = () => editor.chain().focus().toggleStrike().run();
	const handleSuperscript = () =>
		editor.chain().focus().toggleSuperscript().run();
	const handleSubscript = () => editor.chain().focus().toggleSubscript().run();
	const handleStress = () => editor.chain().focus().toggleStress().run();
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
			<AnimatePresence mode="wait" initial={false}>
				{spellingFormOpen && selectedText && spellingSelectionRef.current ? (
					<AddToDictionaryForm
						key="spelling-form"
						wrongForm={selectedText}
						editor={editor}
						selectionFrom={spellingSelectionRef.current.from}
						selectionTo={spellingSelectionRef.current.to}
						onDone={handleCloseSpellingForm}
						onCancel={handleCloseSpellingForm}
					/>
				) : (
					<motion.div
						key="toolbar"
						variants={variants.scaleIn}
						initial="hidden"
						animate="visible"
						exit="exit"
						transition={spring.snappy}
					>
						<div className="flex items-center gap-0.5 rounded-card border border-bd-2 bg-surf px-1.5 py-1.5 shadow-lg backdrop-blur-sm">
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
							<Btn
								title={t("admin.texts.createPage.superscript")}
								active={editor.isActive("superscript")}
								onExec={handleSuperscript}
							>
								<Superscript className="size-[13px]" />
							</Btn>
							<Btn
								title={t("admin.texts.createPage.subscript")}
								active={editor.isActive("subscript")}
								onExec={handleSubscript}
							>
								<Subscript className="size-[13px]" />
							</Btn>
							{showStressMark && (
								<Btn
									title={t("admin.texts.editPage.stressMark")}
									active={editor.isActive("stress")}
									onExec={handleStress}
								>
									<Typography tag="span" className="text-[13px] font-bold leading-none">
										а́
									</Typography>
								</Btn>
							)}
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
							{isHeading && (
								<>
									<Sep />
									{HEADING_FONT_WEIGHTS.map(w => {
										const isActive = activeHeadingFontWeight === w.value ||
											(activeHeadingFontWeight === null && w.value === null);
										const handleWeightMouseDown: NonNullable<ComponentProps<"button">["onMouseDown"]> = e => {
											e.preventDefault();
											editor.chain().focus().setHeadingFontWeight(w.value).run();
										};
										return (
											<Button
												key={w.label}
												size="bare"
												title={`Font weight: ${w.label}`}
												onMouseDown={handleWeightMouseDown}
												className={`flex h-7 shrink-0 items-center justify-center rounded-[6px] px-1.5 text-[11px] transition-all duration-100 select-none
													${isActive
														? "bg-[#2783de]/10 text-[#2783de]"
														: "text-t-2 hover:bg-surf-3 hover:text-t-1 active:scale-95"
													}`}
												style={{ fontWeight: w.cssValue }}
											>
												{w.label}
											</Button>
										);
									})}
								</>
							)}
							{(onEditPhrase || onDeletePhrase) && (
								<>
									<Sep />
									<Languages
										className="mx-1 size-3.5 shrink-0 text-pur-t"
										strokeWidth={1.6}
									/>
									{onEditPhrase && (
										<Btn
											title={t("admin.texts.editPage.phraseEditTitle")}
											onExec={onEditPhrase}
											wide
										>
											<Pencil className="size-[12px]" />
										</Btn>
									)}
									{onDeletePhrase && (
										<Btn
											title={t("admin.texts.editPage.phraseDeleteConfirm")}
											onExec={onDeletePhrase}
										>
											<Trash2 className="size-[12px] text-red" />
										</Btn>
									)}
								</>
							)}
							{(onEditAnnotation || onDeleteAnnotation) && (
								<>
									<Sep />
									<Link2
										className="mx-1 size-3.5 shrink-0 text-acc"
										strokeWidth={1.6}
									/>
									{onEditAnnotation && (
										<Btn
											title={t("admin.texts.editPage.wordAnnotation.edit")}
											onExec={onEditAnnotation}
											wide
										>
											<Pencil className="size-[12px]" />
										</Btn>
									)}
									{onDeleteAnnotation && (
										<Btn
											title={t("admin.texts.editPage.wordAnnotation.delete")}
											onExec={onDeleteAnnotation}
										>
											<Trash2 className="size-[12px] text-red" />
										</Btn>
									)}
								</>
							)}
							{extraToolbarItems && (
								<>
									<Sep />
									{extraToolbarItems}
								</>
							)}
							{showSpellingAdd && selectedText && (
								<>
									<Sep />
									<Btn
										title={t("admin.spellingDictionary.addToSpellingTitle")}
										onExec={handleOpenSpellingForm}
									>
										<SpellCheck className="size-[13px]" />
									</Btn>
								</>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Color portal rendered outside AnimatePresence to avoid blocking clicks during exit animation */}
			{colorOpen && colorAnchor && !spellingFormOpen && createPortal(
				<>
					<div
						className="fixed inset-0 z-9998"
						onMouseDown={handleBackdropMouseDown}
					/>
					<div
						className="fixed z-9999"
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
