"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState, type ComponentProps } from "react";
import type { Note } from "../../api";
import { NoteForm } from "../note-form";

export interface NoteCardProps {
	note: Note;
	onUpdate: (body: string) => void;
	onDelete: () => void;
	className?: string;
}

export const NoteCard = ({ note, onUpdate, onDelete, className }: NoteCardProps) => {
	const { t } = useI18n();
	const [editing, setEditing] = useState(false);

	const handleEdit: NonNullable<ComponentProps<"button">["onClick"]> = () => setEditing(true);
	const handleDelete: NonNullable<ComponentProps<"button">["onClick"]> = () => onDelete();
	const handleSave = (body: string) => {
		onUpdate(body);
		setEditing(false);
	};
	const handleCancel = () => setEditing(false);

	if (editing) {
		return (
			<NoteForm
				initialValue={note.body}
				onSubmit={handleSave}
				onCancel={handleCancel}
				className={className}
			/>
		);
	}

	return (
		<div
			className={cn(
				"group rounded-lg border border-bd-1 bg-surf-2 px-3 py-2.5 text-[13px]",
				className,
			)}
		>
			{note.selectedText && (
				<p className="mb-1.5 border-l-2 border-acc pl-2 text-[12px] text-t-3 italic line-clamp-2">
					{note.selectedText}
				</p>
			)}
			<p className="whitespace-pre-wrap text-t-1">{note.body}</p>
			<div className="mt-2 flex items-center justify-between">
				<span className="text-[11px] text-t-4">
					{new Date(note.updatedAt).toLocaleDateString()}
				</span>
				<div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
					<Button
						variant="bare"
						size={null}
						onClick={handleEdit}
						aria-label={t("reader.notes.edit")}
						className="rounded p-1 text-t-3 hover:bg-surf-3 hover:text-t-1"
					>
						<Pencil className="size-3" strokeWidth={1.6} />
					</Button>
					<Button
						variant="bare"
						size={null}
						onClick={handleDelete}
						aria-label={t("reader.notes.delete")}
						className="rounded p-1 text-t-3 hover:bg-surf-3 hover:text-red-500"
					>
						<Trash2 className="size-3" strokeWidth={1.6} />
					</Button>
				</div>
			</div>
		</div>
	);
};
