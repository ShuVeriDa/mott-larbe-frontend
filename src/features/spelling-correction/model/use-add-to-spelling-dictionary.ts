"use client";

import { useState } from "react";
import { useCreateSpellingEntry } from "@/entities/spelling-dictionary";
import type { CorrectFormNode } from "@/entities/spelling-dictionary";
import { serializeCorrectForm } from "@/entities/spelling-dictionary";
import { useI18n } from "@/shared/lib/i18n";

interface UseAddToSpellingDictionaryOptions {
	onDone: (correctFormNodes: CorrectFormNode[]) => void;
}

export const useAddToSpellingDictionary = ({ onDone }: UseAddToSpellingDictionaryOptions) => {
	const { t } = useI18n();
	const [correctFormNodes, setCorrectFormNodes] = useState<CorrectFormNode[]>([{ text: "" }]);
	const [error, setError] = useState<string | null>(null);

	const createMutation = useCreateSpellingEntry();

	const handleSubmit = async (wrongForm: string) => {
		const plainText = correctFormNodes.map(n => n.text).join("").trim();
		if (!plainText) {
			setError(t("admin.spellingDictionary.form.errorRequired"));
			return;
		}
		const correctForm = serializeCorrectForm(correctFormNodes);
		try {
			await createMutation.mutateAsync({
				wrongForm: wrongForm.toLowerCase().trim(),
				correctForm,
			});
			setCorrectFormNodes([{ text: "" }]);
			setError(null);
			onDone(correctFormNodes);
		} catch {
			setError(t("admin.spellingDictionary.form.errorDuplicate"));
		}
	};

	const reset = () => {
		setCorrectFormNodes([{ text: "" }]);
		setError(null);
	};

	const correctFormPlainText = correctFormNodes.map(n => n.text).join("");

	return {
		correctFormNodes,
		setCorrectFormNodes,
		correctFormPlainText,
		error,
		isPending: createMutation.isPending,
		handleSubmit,
		reset,
	};
};
