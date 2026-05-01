"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	deckApi,
	deckKeys,
	type RateDeckBody,
} from "@/entities/deck";

interface RateDeckVars {
	lemmaId: string;
	body: RateDeckBody;
}

export const useRateDeckCard = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ lemmaId, body }: RateDeckVars) =>
			deckApi.rate(lemmaId, body),
		onSuccess: (data) => {
			if (data.shouldRefreshDeck) {
				qc.invalidateQueries({ queryKey: deckKeys.root });
			} else {
				qc.invalidateQueries({ queryKey: deckKeys.stats() });
			}
		},
	});
};
