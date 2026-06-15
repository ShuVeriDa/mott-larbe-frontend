"use client";

import { useState } from "react";
import { useCreateSpellingEntry } from "@/entities/spelling-dictionary";
import { useI18n } from "@/shared/lib/i18n";

interface UseAddToSpellingDictionaryOptions {
	onDone: (correctForm: string) => void;
}

export const useAddToSpellingDictionary = ({ onDone }: UseAddToSpellingDictionaryOptions) => {
	const { t } = useI18n();
	const [correctForm, setCorrectForm] = useState("");
	const [error, setError] = useState<string | null>(null);

	const createMutation = useCreateSpellingEntry();

	const handleCorrectFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCorrectForm(e.currentTarget.value);
		setError(null);
	};

	const handleSubmit = async (wrongForm: string) => {
		if (!correctForm.trim()) {
			setError(t("admin.spellingDictionary.form.errorRequired"));
			return;
		}
		const trimmed = correctForm.trim();
		try {
			await createMutation.mutateAsync({
				wrongForm: wrongForm.toLowerCase().trim(),
				correctForm: trimmed,
			});
			setCorrectForm("");
			setError(null);
			onDone(trimmed);
		} catch {
			setError(t("admin.spellingDictionary.form.errorDuplicate"));
		}
	};

	const reset = () => {
		setCorrectForm("");
		setError(null);
	};

	return {
		correctForm,
		error,
		isPending: createMutation.isPending,
		handleCorrectFormChange,
		handleSubmit,
		reset,
	};
};
