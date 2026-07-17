"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { getApiErrorCode } from "@/shared/api";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";
import { useGenerateText } from "@/entities/text-generation";
import type {
	GeneratedContentType,
	GeneratedTextResult,
	GenerationDifficulty,
	GenerationGrammarFocus,
	GenerationTone,
	GenerationTopic,
} from "@/entities/text-generation";
import type { PickGenerationWordsState } from "@/features/pick-generation-words";
import type { GenerateUserTextFieldErrors, GenerationApplyMode, UseGenerateUserTextProps } from "./types";

export const useGenerateUserText = (
	{ language, onGenerated, onNeedsGeminiKey, onGeneratingChange, isActivePageEmpty }: UseGenerateUserTextProps,
	words: PickGenerationWordsState,
) => {
	const { toastApiError } = useApiErrorToast();
	const generateMutation = useGenerateText();

	useEffect(() => {
		onGeneratingChange?.(generateMutation.isPending);
	}, [generateMutation.isPending, onGeneratingChange]);

	const [pendingResult, setPendingResult] = useState<GeneratedTextResult | null>(null);
	const [pendingSelectedWordsCount, setPendingSelectedWordsCount] = useState(0);

	const [contentType, setContentType] = useState<GeneratedContentType>("PROSE");
	const [topic, setTopic] = useState<GenerationTopic>("FAMILY");
	const [customTopic, setCustomTopic] = useState("");
	const [tone, setTone] = useState<GenerationTone | undefined>(undefined);
	const [dialogueCharacterCount, setDialogueCharacterCount] = useState(2);
	const [grammarFocus, setGrammarFocus] = useState<GenerationGrammarFocus>("NONE");
	const [customGrammarFocus, setCustomGrammarFocus] = useState("");
	const [targetLength, setTargetLength] = useState(150);
	const [difficulty, setDifficulty] = useState<GenerationDifficulty | undefined>(undefined);
	const [fieldErrors, setFieldErrors] = useState<GenerateUserTextFieldErrors>({});

	const handleContentTypeChange = (e: ChangeEvent<HTMLSelectElement>) =>
		setContentType(e.currentTarget.value as GeneratedContentType);

	const handleTopicChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = e.currentTarget.value as GenerationTopic;
		setTopic(value);
		if (value !== "CUSTOM") setCustomTopic("");
	};

	const handleCustomTopicChange = (e: ChangeEvent<HTMLInputElement>) =>
		setCustomTopic(e.currentTarget.value);

	const handleToneChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = e.currentTarget.value;
		setTone(value === "" ? undefined : (value as GenerationTone));
	};

	const handleDialogueCharacterCountChange = (e: ChangeEvent<HTMLSelectElement>) =>
		setDialogueCharacterCount(Number(e.currentTarget.value));

	const handleGrammarFocusChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = e.currentTarget.value as GenerationGrammarFocus;
		setGrammarFocus(value);
		if (value !== "CUSTOM") setCustomGrammarFocus("");
	};

	const handleCustomGrammarFocusChange = (e: ChangeEvent<HTMLInputElement>) =>
		setCustomGrammarFocus(e.currentTarget.value);

	const handleTargetLengthChange = (e: ChangeEvent<HTMLInputElement>) =>
		setTargetLength(Number(e.currentTarget.value));

	const handleDifficultyChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = e.currentTarget.value;
		setDifficulty(value === "" ? undefined : (value as GenerationDifficulty));
	};

	const handleGenerate = () => {
		const nextFieldErrors: GenerateUserTextFieldErrors = {};
		if (topic === "CUSTOM" && customTopic.trim() === "") {
			nextFieldErrors.customTopic = "required";
		}
		if (grammarFocus === "CUSTOM" && customGrammarFocus.trim() === "") {
			nextFieldErrors.customGrammarFocus = "required";
		}
		setFieldErrors(nextFieldErrors);
		if (Object.keys(nextFieldErrors).length > 0) return;

		const selectedWordsCount = words.selectedEntryIds.size + words.customWords.length;

		generateMutation.mutate(
			{
				language,
				contentType,
				topic,
				...(topic === "CUSTOM" ? { customTopic } : {}),
				tone,
				...(contentType === "DIALOGUE" ? { dialogueCharacterCount } : {}),
				grammarFocus,
				...(grammarFocus === "CUSTOM" ? { customGrammarFocus } : {}),
				dictionaryEntryIds: [...words.selectedEntryIds],
				customWords: words.customWords,
				targetLength,
				difficulty,
			},
			{
				onSuccess: (result) => {
					setPendingResult(result);
					setPendingSelectedWordsCount(selectedWordsCount);
				},
				onError: (error) => {
					if (getApiErrorCode(error) === "GEMINI_KEY_NOT_CONFIGURED") {
						onNeedsGeminiKey();
					} else {
						toastApiError(error);
					}
				},
			},
		);
	};

	const handleApplyGenerated = (applyMode: GenerationApplyMode) => {
		if (!pendingResult) return;
		try {
			onGenerated(pendingResult, pendingSelectedWordsCount, applyMode);
		} finally {
			setPendingResult(null);
		}
	};

	const handleDiscardGenerated = () => setPendingResult(null);

	return {
		contentType,
		topic,
		customTopic,
		tone,
		dialogueCharacterCount,
		grammarFocus,
		customGrammarFocus,
		targetLength,
		difficulty,
		fieldErrors,
		isGenerating: generateMutation.isPending,
		pendingResult,
		isActivePageEmpty,
		handleContentTypeChange,
		handleTopicChange,
		handleCustomTopicChange,
		handleToneChange,
		handleDialogueCharacterCountChange,
		handleGrammarFocusChange,
		handleCustomGrammarFocusChange,
		handleTargetLengthChange,
		handleDifficultyChange,
		handleGenerate,
		handleApplyGenerated,
		handleDiscardGenerated,
	};
};
