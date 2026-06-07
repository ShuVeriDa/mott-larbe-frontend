"use client";

import { useMutation } from "@tanstack/react-query";
import {
	type RateReviewBody,
	reviewApi,
} from "@/entities/review";

interface RateWordVars {
	lemmaId: string;
	body: RateReviewBody;
}

export const useRateWord = () => {
	return useMutation({
		mutationFn: ({ lemmaId, body }: RateWordVars) =>
			reviewApi.rate(lemmaId, body),
	});
};
