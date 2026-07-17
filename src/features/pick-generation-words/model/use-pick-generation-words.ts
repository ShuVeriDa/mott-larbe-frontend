"use client";

import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useDictionaryList } from "@/entities/dictionary";
import type { DictionaryEntry } from "@/entities/dictionary";

export const MAX_GENERATION_WORDS = 30;

export const usePickGenerationWords = () => {
	const { data, isPending } = useDictionaryList({ limit: 100, sort: "added" });
	const dictionaryWords: DictionaryEntry[] = data?.items ?? [];

	const [selectedEntryIds, setSelectedEntryIds] = useState<Set<string>>(() => new Set());
	const [customWords, setCustomWords] = useState<string[]>([]);
	const [customWordInput, setCustomWordInput] = useState("");

	const totalSelectedCount = selectedEntryIds.size + customWords.length;
	const isAtLimit = totalSelectedCount >= MAX_GENERATION_WORDS;

	const handleToggleDictionaryWord = (entryId: string) => {
		setSelectedEntryIds((prev) => {
			const next = new Set(prev);
			if (next.has(entryId)) {
				next.delete(entryId);
			} else if (next.size + customWords.length < MAX_GENERATION_WORDS) {
				next.add(entryId);
			}
			return next;
		});
	};

	const handleAddCustomWord = () => {
		const trimmed = customWordInput.trim();
		if (!trimmed) return;
		if (customWords.some((w) => w.toLowerCase() === trimmed.toLowerCase())) return;
		if (selectedEntryIds.size + customWords.length >= MAX_GENERATION_WORDS) return;

		setCustomWords((prev) => [...prev, trimmed]);
		setCustomWordInput("");
	};

	const handleRemoveCustomWord = (word: string) => {
		setCustomWords((prev) => prev.filter((w) => w !== word));
	};

	const handleCustomWordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCustomWordInput(e.currentTarget.value);
	};

	const handleCustomWordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddCustomWord();
		}
	};

	return {
		dictionaryWords,
		isDictionaryLoading: isPending,
		selectedEntryIds,
		customWords,
		customWordInput,
		totalSelectedCount,
		isAtLimit,
		handleToggleDictionaryWord,
		handleAddCustomWord,
		handleRemoveCustomWord,
		handleCustomWordInputChange,
		handleCustomWordKeyDown,
	};
};
