"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Languages, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface PhraseEditorPopupProps {
	x: number;
	y: number;
	phraseText: string;
	onEdit: () => void;
	onDelete: () => void;
	onDismiss: () => void;
}

export const PhraseEditorPopup = ({
	x,
	y,
	phraseText: _phraseText,
	onEdit,
	onDelete,
	onDismiss,
}: PhraseEditorPopupProps) => {
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

	if (typeof window === "undefined") return null;

	return createPortal(
		<div
			ref={ref}
			style={{
				position: "fixed",
				left: x,
				top: y - 44,
				transform: "translateX(-50%)",
				zIndex: 9999,
			}}
			className="flex items-center gap-0.5 rounded-lg border border-bd-2 bg-surf px-1.5 py-1.5 shadow-md"
			role="toolbar"
		>
			<Languages className="mx-1 size-3.5 text-pur-t" strokeWidth={1.6} />
			<button
				onClick={e => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
				title={t("admin.texts.editPage.phraseEditTitle")}
				className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11.5px] font-medium text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<Pencil className="size-3" strokeWidth={1.6} />
				{t("admin.texts.editPage.phraseEditTitle")}
			</button>
			<div className="mx-0.5 h-3.5 w-px bg-bd-2" />
			<button
				onClick={e => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
				title={t("admin.texts.editPage.phraseDeleteConfirm")}
				className="rounded p-1 text-t-3 transition-colors hover:bg-red/10 hover:text-red"
			>
				<Trash2 className="size-3.5" strokeWidth={1.6} />
			</button>
		</div>,
		document.body,
	);
};
