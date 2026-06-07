"use client";

import { useMutation } from "@tanstack/react-query";
import {
	deckApi,
	type RateDeckBody,
} from "@/entities/deck";

interface RateDeckVars {
	lemmaId: string;
	body: RateDeckBody;
}

export const useRateDeckCard = () => {
	return useMutation({
		mutationFn: ({ lemmaId, body }: RateDeckVars) =>
			deckApi.rate(lemmaId, body),
	});
};
