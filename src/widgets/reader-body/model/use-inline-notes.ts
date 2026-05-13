"use client";

import {
	useCreateNote,
	useDeleteNote,
	useNotes,
	useUpdateNote,
	type Note,
} from "@/entities/note";
import { useCallback, useMemo, useState } from "react";

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

	const noteMarks = useMemo<NoteMarkItem[]>(
		() =>
			notes
				.filter(n => !!n.selectedText)
				.map(n => ({
					id: n.id,
					selectedText: n.selectedText!,
					isActive: n.id === activeNoteId,
				})),
		[notes, activeNoteId],
	);

	const activeNotePopup = useMemo<NotePopupState | null>(() => {
		if (!activeNoteId || !popupPosition) return null;
		const note = notes.find(n => n.id === activeNoteId) ?? null;
		if (!note) return null;
		return { note, ...popupPosition };
	}, [activeNoteId, popupPosition, notes]);

	// Called by NoteGroupIcon when user clicks a line's icon
	const handleNoteGroupClick = useCallback((noteIds: string[], x: number, y: number) => {
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
	}, [notes]);

	// Called from group popup when user picks a specific note
	const handleNoteIconClick = useCallback((noteId: string, x: number, y: number) => {
		setActiveNoteId(noteId);
		setPopupPosition({ x, y });
		setGroupPopup(null);
	}, []);

	const handleClosePopup = useCallback(() => {
		setActiveNoteId(null);
		setPopupPosition(null);
	}, []);

	const handleCloseGroupPopup = useCallback(() => {
		setGroupPopup(null);
	}, []);

	const handleAddNote = useCallback(
		(selectedText: string, body: string) => {
			createNote({ textId, pageNumber, selectedText, body });
		},
		[createNote, textId, pageNumber],
	);

	const handleUpdateNote = useCallback(
		(id: string, body: string) => {
			updateNote({ id, dto: { body } });
		},
		[updateNote],
	);

	const handleDeleteNote = useCallback(
		(id: string) => {
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
		},
		[deleteNote, activeNoteId, groupPopup],
	);

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
