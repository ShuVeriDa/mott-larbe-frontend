"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deckApi, deckKeys } from "@/entities/deck";

export const useAddToRepeat = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (lemmaId: string) => deckApi.addToRepeat(lemmaId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: deckKeys.root });
		},
	});
};

export const useReturnFromRepeat = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (lemmaId: string) => deckApi.returnFromRepeat(lemmaId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: deckKeys.root });
		},
	});
};
