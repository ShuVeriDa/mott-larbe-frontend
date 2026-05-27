"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { phrasebookApi, phrasebookKeys, type PhraseReviewQuality } from "@/entities/phrasebook";

export const useRatePhrase = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ phraseId, quality }: { phraseId: string; quality: PhraseReviewQuality }) =>
			phrasebookApi.ratePhrase(phraseId, quality),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: phrasebookKeys.reviewStats() });
			qc.invalidateQueries({ queryKey: phrasebookKeys.reviewDue() });
			qc.invalidateQueries({ queryKey: phrasebookKeys.categoryProgress() });
		},
	});
};
