"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Highlighter, Trash2 } from "lucide-react";
import { ComponentProps, useEffect, useRef } from "react";
import { HIGHLIGHT_COLOR_HEX, type HighlightColor } from "../../model";

const COLORS: HighlightColor[] = ["yellow", "green", "blue", "pink"];

export interface HighlightColorPickerProps {
	x: number;
	y: number;
	onPick: (color: HighlightColor) => void;
	onRemove?: () => void;
	onDismiss: () => void;
	hasExisting?: boolean;
}

export const HighlightColorPicker = ({
	x,
	y,
	onPick,
	onRemove,
	onDismiss,
	hasExisting = false,
}: HighlightColorPickerProps) => {
	const { t } = useI18n();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				onDismiss();
			}
		};
		document.addEventListener("mousedown", handleMouseDown);
		return () => document.removeEventListener("mousedown", handleMouseDown);
	}, [onDismiss]);

	const style = {
		position: "fixed" as const,
		left: x,
		top: y - 48,
		transform: "translateX(-50%)",
		zIndex: 9999,
	};

	return (
		<div
			ref={ref}
			style={style}
			className="flex items-center gap-1 rounded-lg border border-bd-1 bg-surf px-2 py-1.5 shadow-md"
			role="toolbar"
			aria-label={t("reader.highlight.toolbar")}
		>
			<Highlighter className="mr-1 size-3.5 text-t-3" strokeWidth={1.6} />
			{COLORS.map((color) => {
				const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = (e) => {
					e.preventDefault();
					e.stopPropagation();
					onPick(color);
				};
				return (
					<button
						key={color}
						onClick={handleClick}
						aria-label={t(`reader.highlight.color.${color}`)}
						className="size-5 rounded-full border border-black/10 transition-transform hover:scale-110 focus-visible:outline-2"
						style={{ backgroundColor: HIGHLIGHT_COLOR_HEX[color] }}
					/>
				);
			})}
			{hasExisting && onRemove && (
				<button
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onRemove();
					}}
					aria-label={t("reader.highlight.remove")}
					className="ml-1 rounded p-0.5 text-t-3 hover:bg-surf-2 hover:text-t-1"
				>
					<Trash2 className="size-3.5" strokeWidth={1.6} />
				</button>
			)}
		</div>
	);
};
