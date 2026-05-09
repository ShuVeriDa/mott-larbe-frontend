"use client";

import axios from "axios";
import { type ComponentProps, useState } from "react";
import { useFolders } from "@/entities/folder";
import { useI18n } from "@/shared/lib/i18n";
import { type CefrLevel } from "@/shared/types";
import { useAddWord } from "./use-add-word";

interface UseAddWordModalParams {
	onClose: () => void;
}

export const useAddWordModal = ({ onClose }: UseAddWordModalParams) => {
	const { t } = useI18n();
	const { data: folders } = useFolders();
	const { mutateAsync, isPending } = useAddWord();

	const [word, setWord] = useState("");
	const [translation, setTranslation] = useState("");
	const [folderId, setFolderId] = useState("");
	const [cefrLevel, setCefrLevel] = useState("");
	const [error, setError] = useState<string | null>(null);

	const reset = () => {
		setWord("");
		setTranslation("");
		setFolderId("");
		setCefrLevel("");
		setError(null);
	};

	const handleSubmit = async () => {
		if (!word.trim() || !translation.trim()) return;
		setError(null);
		try {
			await mutateAsync({
				word: word.trim(),
				translation: translation.trim(),
				folderId: folderId || null,
				cefrLevel: (cefrLevel as CefrLevel) || null,
			});
			reset();
			onClose();
		} catch (errorValue) {
			if (axios.isAxiosError(errorValue) && errorValue.response?.status === 403) {
				setError(t("vocabulary.limitReached"));
			}
		}
	};

	const handleWordChange: NonNullable<ComponentProps<"input">["onChange"]> = (
		event,
	) => setWord(event.currentTarget.value);
	const handleTranslationChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = (event) => setTranslation(event.currentTarget.value);
	const handleFolderChange: NonNullable<ComponentProps<"select">["onChange"]> = (
		event,
	) => setFolderId(event.currentTarget.value);
	const handleCefrLevelChange: NonNullable<
		ComponentProps<"select">["onChange"]
	> = (event) => setCefrLevel(event.currentTarget.value);

	return {
		t,
		folders,
		isPending,
		word,
		translation,
		folderId,
		cefrLevel,
		error,
		handleSubmit,
		handleWordChange,
		handleTranslationChange,
		handleFolderChange,
		handleCefrLevelChange,
	};
};
