"use client";

import {
	useCreateNote,
	useDeleteNote,
	useNotes,
	useUpdateNote,
	type Note,
} from "@/entities/note";
import { useState } from "react";

export interface NoteMarkItem {
	id: string;
	selectedText: string;
	isActive: boolean;
}

export interface NotePopupState {
	note: Note;
	x: number;
	y: number;
}

export interface NoteGroupPopupState {
	notes: Note[];
	x: number;
	y: number;
}

export const useInlineNotes = (textId: string, pageNumber: number) => {
	const { data: notes = [] } = useNotes(textId, pageNumber);
	const { mutate: createNote } = useCreateNote(textId, pageNumber);
	const { mutate: updateNote } = useUpdateNote(textId, pageNumber);
	const { mutate: deleteNote } = useDeleteNote(textId, pageNumber);

	const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
	const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

	// Group popup: shown when a line has multiple notes
	const [groupPopup, setGroupPopup] = useState<NoteGroupPopupState | null>(null);

	const noteMarks: NoteMarkItem[] = notes
		.filter(n => !!n.selectedText)
		.map(n => ({
			id: n.id,
			selectedText: n.selectedText!,
			isActive: n.id === activeNoteId,
		}));

	const activeNotePopup: NotePopupState | null = (() => {
		if (!activeNoteId || !popupPosition) return null;
		const note = notes.find(n => n.id === activeNoteId) ?? null;
		if (!note) return null;
		return { note, ...popupPosition };
	})();

	const handleNoteGroupClick = (noteIds: string[], x: number, y: number) => {
		const groupNotes = noteIds
			.map(id => notes.find(n => n.id === id))
			.filter((n): n is Note => !!n);
		if (groupNotes.length === 0) return;
		if (groupNotes.length === 1) {
			setActiveNoteId(groupNotes[0].id);
			setPopupPosition({ x, y });
			setGroupPopup(null);
		} else {
			setGroupPopup({ notes: groupNotes, x, y });
			setActiveNoteId(null);
			setPopupPosition(null);
		}
	};

	const handleNoteIconClick = (noteId: string, x: number, y: number) => {
		setActiveNoteId(noteId);
		setPopupPosition({ x, y });
		setGroupPopup(null);
	};

	const handleClosePopup = () => {
		setActiveNoteId(null);
		setPopupPosition(null);
	};

	const handleCloseGroupPopup = () => {
		setGroupPopup(null);
	};

	const handleAddNote = (selectedText: string, body: string) => {
		const trimmedBody = body.trim().slice(0, 10_000);
		if (!trimmedBody) return;
		createNote({ textId, pageNumber, selectedText: selectedText.slice(0, 2_000), body: trimmedBody });
	};

	const handleUpdateNote = (id: string, body: string) => {
		const trimmedBody = body.trim().slice(0, 10_000);
		if (!trimmedBody) return;
		updateNote({ id, dto: { body: trimmedBody } });
	};

	const handleDeleteNote = (id: string) => {
		deleteNote(id);
		if (activeNoteId === id) {
			setActiveNoteId(null);
			setPopupPosition(null);
		}
		if (groupPopup) {
			const remaining = groupPopup.notes.filter(n => n.id !== id);
			if (remaining.length === 0) {
				setGroupPopup(null);
			} else {
				setGroupPopup(prev => prev ? { ...prev, notes: remaining } : null);
			}
		}
	};

	return {
		noteMarks,
		activeNotePopup,
		groupPopup,
		handleNoteGroupClick,
		handleNoteIconClick,
		handleClosePopup,
		handleCloseGroupPopup,
		handleAddNote,
		handleUpdateNote,
		handleDeleteNote,
	};
};
