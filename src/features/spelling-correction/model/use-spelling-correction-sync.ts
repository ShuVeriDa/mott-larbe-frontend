"use client";

import { useEffect } from "react";
import type { Editor } from "@tiptap/react";
import { useSpellingDictionary } from "@/entities/spelling-dictionary";

/**
 * Loads the spelling dictionary and pushes entries into the Tiptap extension
 * whenever the editor mounts or the dictionary data changes.
 */
export const useSpellingCorrectionSync = (editor: Editor | null) => {
	const { data: entries } = useSpellingDictionary();

	useEffect(() => {
		if (!editor || !entries) return;
		editor.commands.setSpellingEntries(entries);
	}, [editor, entries]);
};
