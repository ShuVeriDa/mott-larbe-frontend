"use client";

import {
	NoteCard,
	NoteForm,
	useCreateNote,
	useDeleteNote,
	useNotes,
	useUpdateNote,
} from "@/entities/note";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { NotebookPen } from "lucide-react";

export const NotesPanelBody = ({
	textId,
	pageNumber,
}: {
	textId: string;
	pageNumber: number;
}) => {
	const { t } = useI18n();
	const { data: notes = [], isLoading } = useNotes(textId, pageNumber);
	const { mutate: createNote } = useCreateNote(textId, pageNumber);
	const { mutate: updateNote } = useUpdateNote(textId, pageNumber);
	const { mutate: deleteNote } = useDeleteNote(textId, pageNumber);

	const handleCreate = (body: string) => {
		createNote({ textId, pageNumber, body });
	};

	const handleUpdate = (id: string, body: string) => {
		updateNote({ id, dto: { body } });
	};

	const handleDelete = (id: string) => {
		deleteNote(id);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3">
			<NoteForm onSubmit={handleCreate} />
			{isLoading && (
				<Typography className="text-[12px] text-t-4">
					{t("reader.notes.loading")}
				</Typography>
			)}
			{!isLoading && notes.length === 0 && (
				<div className="flex flex-col items-center gap-2 py-6 text-center">
					<NotebookPen className="size-8 text-t-4" strokeWidth={1.2} />
					<Typography className="text-[13px] text-t-3">
						{t("reader.notes.empty")}
					</Typography>
				</div>
			)}
			<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
				{notes.map(note => (
					<NoteCard
						key={note.id}
						note={note}
						onUpdate={body => handleUpdate(note.id, body)}
						onDelete={() => handleDelete(note.id)}
					/>
				))}
			</div>
		</div>
	);
};
