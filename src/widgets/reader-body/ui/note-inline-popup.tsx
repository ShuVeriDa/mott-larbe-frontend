"use client";

import { NoteCard } from "@/entities/note";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";
import { type ComponentProps, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { NotePopupState } from "../model/use-inline-notes";

export interface NoteInlinePopupProps {
	popup: NotePopupState;
	onClose: () => void;
	onUpdate: (id: string, body: string) => void;
	onDelete: (id: string) => void;
}

export const NoteInlinePopup = ({
	popup,
	onClose,
	onUpdate,
	onDelete,
}: NoteInlinePopupProps) => {
	const { t } = useI18n();
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleMouseDown = (e: MouseEvent) => {
			if (!ref.current?.contains(e.target as Node)) {
				if ((e.target as Element).closest("[data-note-icon]")) return;
				onClose();
			}
		};
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		const handleScroll = () => onClose();

		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("scroll", handleScroll, true);
		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("scroll", handleScroll, true);
		};
	}, [onClose]);

	const left =
		typeof window !== "undefined"
			? Math.max(8, Math.min(popup.x - 132, window.innerWidth - 272))
			: popup.x - 132;

	const handleClose: NonNullable<ComponentProps<"button">["onClick"]> = () => onClose();

	const handleUpdate = (body: string) => onUpdate(popup.note.id, body);

	const handleDelete = () => {
		onDelete(popup.note.id);
		onClose();
	};

	if (typeof window === "undefined") return null;

	return createPortal(
		<div
			ref={ref}
			style={{ position: "fixed", left, top: popup.y + 8, zIndex: 9999, width: 264 }}
			className="rounded-xl border border-bd-1 bg-surf shadow-lg"
		>
			<div className="flex shrink-0 items-center justify-between border-b border-bd-1 px-3 py-2">
				<span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-t-3">
					{t("reader.notes.title")}
				</span>
				<Button
					variant="bare"
					size={null}
					onClick={handleClose}
					aria-label={t("reader.notes.cancel")}
					className="rounded p-0.5 text-t-3 hover:bg-surf-2 hover:text-t-1"
				>
					<X className="size-3.5" strokeWidth={1.6} />
				</Button>
			</div>
			<div className="p-2">
				<NoteCard note={popup.note} onUpdate={handleUpdate} onDelete={handleDelete} />
			</div>
		</div>,
		document.body,
	);
};
