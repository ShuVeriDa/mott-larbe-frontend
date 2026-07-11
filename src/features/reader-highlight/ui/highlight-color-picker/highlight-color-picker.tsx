"use client";

import { NoteForm } from "@/entities/note";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { variants, spring } from "@/shared/lib/animation";
import { useMediaQuery } from "@/shared/lib/media-query";
import { useTokenRangeSelectionStore } from "@/shared/lib/token-range-selection";
import { Button } from "@/shared/ui/button";
import { Highlighter, MessageSquare, Palette, Sparkles, Trash2 } from "lucide-react";
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { HIGHLIGHT_COLOR_HEX, type HighlightColor } from "../../model";

const PRESET_COLORS: HighlightColor[] = [
	"yellow",
	"orange",
	"red",
	"pink",
	"purple",
	"blue",
	"teal",
	"green",
];

export interface HighlightColorPickerProps {
	x: number;
	y: number;
	bottom: number;
	onPick: (color: HighlightColor | string) => void;
	onRemove?: () => void;
	onDismiss: () => void;
	hasExisting?: boolean;
	onAddNote?: (body: string) => void;
	onTranslatePhrase?: () => void;
}

export const HighlightColorPicker = ({
	x,
	y,
	bottom,
	onPick,
	onRemove,
	onDismiss,
	hasExisting = false,
	onAddNote,
	onTranslatePhrase,
}: HighlightColorPickerProps) => {
	const { t } = useI18n();
	const ref = useRef<HTMLDivElement>(null);
	const [showNoteForm, setShowNoteForm] = useState(false);
	const [showPalette, setShowPalette] = useState(false);

	useEffect(() => {
		const handleOutside = (e: MouseEvent | TouchEvent) => {
			const target = e instanceof TouchEvent ? e.touches[0]?.target : (e as MouseEvent).target;
			if (!(target instanceof Node)) return;
			if (ref.current?.contains(target)) return;

			// While a touch range-selection is active, a tap on a WORD inside the
			// article is not "outside" — it's the user extending the range (see
			// ArticleToken's onRangeTap). This listener fires on touchstart, which
			// happens before the token's own onClick, so without this guard every
			// tap-to-extend would dismiss the toolbar first and the extend would
			// never be reached.
			const isRangeSelecting = useTokenRangeSelectionStore.getState().isActive;
			const isInsideArticle = (target as Element).closest?.("[data-article-rich]");
			if (isRangeSelecting && isInsideArticle) return;

			onDismiss();
		};
		document.addEventListener("mousedown", handleOutside as EventListener);
		document.addEventListener("touchstart", handleOutside as EventListener, { passive: true });
		return () => {
			document.removeEventListener("mousedown", handleOutside as EventListener);
			document.removeEventListener("touchstart", handleOutside as EventListener);
		};
	}, [onDismiss]);

	// Touch devices (Android/iOS) render their own native selection action bar
	// directly above the selected text. Placing our toolbar above it too causes
	// an overlap, so on touch we anchor below the selection instead — the two
	// UIs then sit in separate zones instead of fighting for the same space.
	const isTouchDevice = useMediaQuery("(pointer: coarse)");

	const POPUP_HALF_W = 130;
	const POPUP_H = 96;
	const clampedX = typeof window !== "undefined"
		? Math.min(Math.max(x, POPUP_HALF_W), window.innerWidth - POPUP_HALF_W)
		: x;
	const rawTop = isTouchDevice ? bottom + 12 : y - 48;
	const clampedTop = typeof window !== "undefined"
		? Math.min(Math.max(rawTop, 8), window.innerHeight - POPUP_H - 8)
		: rawTop;

	const baseStyle: HTMLMotionProps<"div">["style"] = {
		position: "fixed",
		left: clampedX,
		top: clampedTop,
		translateX: "-50%",
		zIndex: 9999,
	};

	const handleShowNoteForm: NonNullable<ComponentProps<"button">["onClick"]> = e => {
		e.preventDefault();
		e.stopPropagation();
		setShowNoteForm(true);
	};

	const handleNoteSubmit = (body: string) => {
		onAddNote?.(body);
		onDismiss();
	};

	const handleNoteCancel = () => setShowNoteForm(false);

	const handleTogglePalette: NonNullable<ComponentProps<"button">["onClick"]> = e => {
		e.preventDefault();
		e.stopPropagation();
		setShowPalette(prev => !prev);
	};

	const handleColorPick = (color: HighlightColor) => {
		onPick(color);
	};

	const handleCustomColor: NonNullable<ComponentProps<"input">["onChange"]> = e => {
		onPick(e.currentTarget.value);
	};

	return (
		<AnimatePresence mode="wait">
			{showNoteForm ? (
				<motion.div
					key="note-form"
					ref={ref}
					style={{ ...baseStyle, width: 240 }}
					className="rounded-lg border border-bd-1 bg-surf p-2.5 shadow-md"
					variants={variants.scaleIn}
					initial="hidden"
					animate="visible"
					exit="exit"
					transition={spring.snappy}
				>
					<NoteForm onSubmit={handleNoteSubmit} onCancel={handleNoteCancel} />
				</motion.div>
			) : (
				<motion.div
					key="toolbar"
					ref={ref}
					style={baseStyle}
					className="rounded-lg border border-bd-1 bg-surf shadow-md"
					role="toolbar"
					aria-label={t("reader.highlight.toolbar")}
					variants={variants.scaleIn}
					initial="hidden"
					animate="visible"
					exit="exit"
					transition={spring.snappy}
				>
					{/* Main row */}
					<div className="flex items-center gap-1 px-2 py-1.5">
						<Highlighter className="mr-0.5 size-3.5 text-t-3 shrink-0" strokeWidth={1.6} />

						{/* First 4 preset colors always visible */}
						{PRESET_COLORS.slice(0, 4).map(color => {
							const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = e => {
								e.preventDefault();
								e.stopPropagation();
								handleColorPick(color);
							};
							return (
								<Button
									key={color}
									onClick={handleClick}
									title={t(`reader.highlight.color.${color}`)}
									aria-label={t(`reader.highlight.color.${color}`)}
									className="size-5 rounded-full border border-black/10 transition-transform duration-150 ease-out hover:scale-110 focus-visible:outline-2 shrink-0"
									style={{ backgroundColor: HIGHLIGHT_COLOR_HEX[color] }}
								/>
							);
						})}

						{/* Palette toggle — shows/hides second row */}
						<Button
							onClick={handleTogglePalette}
							title={t("reader.highlight.morePalette")}
							aria-label={t("reader.highlight.morePalette")}
							aria-pressed={showPalette}
							className={cn(
								"rounded p-0.5 transition-colors duration-150 ease-out",
								showPalette
									? "bg-acc-bg text-acc-t"
									: "text-t-3 hover:bg-surf-2 hover:text-t-1",
							)}
						>
							<Palette className="size-3.5" strokeWidth={1.6} />
						</Button>

						{onAddNote && (
							<Button
								onClick={handleShowNoteForm}
								title={t("reader.highlight.addNote")}
								aria-label={t("reader.highlight.addNote")}
								className="rounded p-0.5 text-t-3 transition-colors duration-150 ease-out hover:bg-surf-2 hover:text-t-1"
							>
								<MessageSquare className="size-3.5" strokeWidth={1.6} />
							</Button>
						)}
						{onTranslatePhrase && (
							<Button
								onClick={onTranslatePhrase}
								title={t("aiTranslation.phrase.button")}
								aria-label={t("aiTranslation.phrase.button")}
								className="rounded p-0.5 text-pur-t transition-colors duration-150 ease-out hover:bg-pur-bg"
							>
								<Sparkles className="size-3.5" strokeWidth={1.6} />
							</Button>
						)}
						{hasExisting && onRemove && (
							<Button
								onClick={e => {
									e.preventDefault();
									e.stopPropagation();
									onRemove();
								}}
								title={t("reader.highlight.remove")}
								aria-label={t("reader.highlight.remove")}
								className="rounded p-0.5 text-t-3 transition-colors duration-150 ease-out hover:bg-surf-2 hover:text-t-1"
							>
								<Trash2 className="size-3.5" strokeWidth={1.6} />
							</Button>
						)}
					</div>

					{/* Extended palette — 4 more presets + custom picker */}
					<AnimatePresence>
						{showPalette && (
							<motion.div
								variants={variants.fadeUp}
								initial="hidden"
								animate="visible"
								exit="exit"
								transition={spring.snappy}
								className="flex items-center gap-1 border-t border-bd-1 px-2 py-1.5"
							>
								{PRESET_COLORS.slice(4).map(color => {
									const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = e => {
										e.preventDefault();
										e.stopPropagation();
										handleColorPick(color);
									};
									return (
										<Button
											key={color}
											onClick={handleClick}
											title={t(`reader.highlight.color.${color}`)}
											aria-label={t(`reader.highlight.color.${color}`)}
											className="size-5 rounded-full border border-black/10 transition-transform duration-150 ease-out hover:scale-110 focus-visible:outline-2 shrink-0"
											style={{ backgroundColor: HIGHLIGHT_COLOR_HEX[color] }}
										/>
									);
								})}
								<div className="mx-1 h-3.5 w-px bg-bd-1" />
								<label
									aria-label={t("reader.highlight.customColor")}
									className="relative flex size-5 cursor-pointer items-center justify-center rounded-full border border-dashed border-bd-2 overflow-hidden transition-transform duration-150 ease-out hover:scale-110"
									style={{
										background: "conic-gradient(from 0deg, #f87171, #fb923c, #facc15, #4ade80, #60a5fa, #c084fc, #f87171)",
									}}
								>
									<input
										type="color"
										className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
										onChange={handleCustomColor}
										onClick={e => e.stopPropagation()}
									/>
								</label>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
