"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	type RateReviewBody,
	reviewApi,
	reviewKeys,
} from "@/entities/review";
import { dictionaryKeys } from "@/entities/dictionary";

interface RateWordVars {
	lemmaId: string;
	body: RateReviewBody;
}

export const useRateWord = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ lemmaId, body }: RateWordVars) =>
			reviewApi.rate(lemmaId, body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: reviewKeys.root });
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
	});
};
