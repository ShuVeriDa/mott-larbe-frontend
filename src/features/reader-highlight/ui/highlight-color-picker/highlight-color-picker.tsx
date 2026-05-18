"use client";

import { NoteForm } from "@/entities/note";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Highlighter, MessageSquare, Palette, Trash2 } from "lucide-react";
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
	onPick: (color: HighlightColor | string) => void;
	onRemove?: () => void;
	onDismiss: () => void;
	hasExisting?: boolean;
	onAddNote?: (body: string) => void;
}

export const HighlightColorPicker = ({
	x,
	y,
	onPick,
	onRemove,
	onDismiss,
	hasExisting = false,
	onAddNote,
}: HighlightColorPickerProps) => {
	const { t } = useI18n();
	const ref = useRef<HTMLDivElement>(null);
	const [showNoteForm, setShowNoteForm] = useState(false);
	const [showPalette, setShowPalette] = useState(false);

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				onDismiss();
			}
		};
		document.addEventListener("mousedown", handleMouseDown);
		return () => document.removeEventListener("mousedown", handleMouseDown);
	}, [onDismiss]);

	const baseStyle = {
		position: "fixed" as const,
		left: x,
		top: y - 48,
		transform: "translateX(-50%)",
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

	if (showNoteForm) {
		return (
			<div
				ref={ref}
				style={{ ...baseStyle, width: 240, transform: "translateX(-50%)" }}
				className="rounded-lg border border-bd-1 bg-surf p-2.5 shadow-md"
			>
				<NoteForm onSubmit={handleNoteSubmit} onCancel={handleNoteCancel} />
			</div>
		);
	}

	return (
		<div
			ref={ref}
			style={baseStyle}
			className="rounded-lg border border-bd-1 bg-surf shadow-md"
			role="toolbar"
			aria-label={t("reader.highlight.toolbar")}
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
							className="size-5 rounded-full border border-black/10 transition-transform hover:scale-110 focus-visible:outline-2 shrink-0"
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
						"rounded p-0.5 transition-colors",
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
						className="rounded p-0.5 text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						<MessageSquare className="size-3.5" strokeWidth={1.6} />
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
						className="rounded p-0.5 text-t-3 hover:bg-surf-2 hover:text-t-1"
					>
						<Trash2 className="size-3.5" strokeWidth={1.6} />
					</Button>
				)}
			</div>

			{/* Extended palette — 4 more presets + custom picker */}
			{showPalette && (
				<div className="flex items-center gap-1 border-t border-bd-1 px-2 py-1.5">
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
								className="size-5 rounded-full border border-black/10 transition-transform hover:scale-110 focus-visible:outline-2 shrink-0"
								style={{ backgroundColor: HIGHLIGHT_COLOR_HEX[color] }}
							/>
						);
					})}
					<div className="mx-1 h-3.5 w-px bg-bd-1" />
					<label
						aria-label={t("reader.highlight.customColor")}
						className="relative flex size-5 cursor-pointer items-center justify-center rounded-full border border-dashed border-bd-2 overflow-hidden transition-transform hover:scale-110"
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
				</div>
			)}
		</div>
	);
};
