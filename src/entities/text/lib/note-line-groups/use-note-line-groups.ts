"use client";

import { useEffect, useRef, useState } from "react";

export interface NoteLineGroup {
	noteIds: string[];
	// fixed viewport coordinates for the icon button
	x: number;
	y: number;
}

const LINE_TOLERANCE_PX = 4;

const groupByLine = (
	marks: { noteId: string; top: number; right: number; bottom: number }[],
): NoteLineGroup[] => {
	const groups: { top: number; right: number; bottom: number; noteIds: string[] }[] = [];

	for (const m of marks) {
		const existing = groups.find(g => Math.abs(g.top - m.top) <= LINE_TOLERANCE_PX);
		if (existing) {
			if (!existing.noteIds.includes(m.noteId)) {
				existing.noteIds.push(m.noteId);
			}
			existing.right = Math.max(existing.right, m.right);
			existing.bottom = Math.max(existing.bottom, m.bottom);
		} else {
			groups.push({ top: m.top, right: m.right, bottom: m.bottom, noteIds: [m.noteId] });
		}
	}

	return groups.map(g => ({
		noteIds: g.noteIds,
		x: g.right + 8,
		y: g.top,
	}));
};

export const useNoteLineGroups = (
	containerRef: React.RefObject<HTMLElement | null>,
	noteMarkIds: string[],
): NoteLineGroup[] => {
	const [groups, setGroups] = useState<NoteLineGroup[]>([]);
	const frameRef = useRef<number | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const measure = () => {
			const markEls = container.querySelectorAll<HTMLElement>("[data-note-id]");
			if (!markEls.length) {
				setGroups([]);
				return;
			}

			// x is always the right edge of the article container, not the mark
			const containerRight = container.getBoundingClientRect().right;

			const seen = new Map<string, { top: number; bottom: number }>();
			markEls.forEach(el => {
				const noteId = el.dataset.noteId!;
				const rect = el.getBoundingClientRect();
				const existing = seen.get(noteId);
				if (!existing || rect.top < existing.top) {
					seen.set(noteId, { top: rect.top, bottom: rect.bottom });
				}
			});

			const marks = Array.from(seen.entries()).map(([noteId, pos]) => ({
				noteId,
				top: pos.top,
				right: containerRight,
				bottom: pos.bottom,
			}));

			setGroups(groupByLine(marks));
		};

		const schedule = () => {
			if (frameRef.current) cancelAnimationFrame(frameRef.current);
			frameRef.current = requestAnimationFrame(measure);
		};

		schedule();

		const ro = new ResizeObserver(schedule);
		ro.observe(container);

		return () => {
			ro.disconnect();
			if (frameRef.current) cancelAnimationFrame(frameRef.current);
		};
	}, [containerRef, noteMarkIds]);

	return groups;
};
