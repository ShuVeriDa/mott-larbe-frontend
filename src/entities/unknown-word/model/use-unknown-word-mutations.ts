"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unknownWordApi } from "../api/unknown-word-api";
import { unknownWordKeys } from "../api/unknown-word-keys";
import type { AddToDictionaryPayload, LinkToLemmaPayload } from "../api/types";

export const useUnknownWordMutations = () => {
	const qc = useQueryClient();
	const invalidate = () =>
		qc.invalidateQueries({ queryKey: unknownWordKeys.root });

	const remove = useMutation({
		mutationFn: unknownWordApi.remove,
		onSuccess: invalidate,
	});

	const clearAll = useMutation({
		mutationFn: unknownWordApi.clearAll,
		onSuccess: invalidate,
	});

	const bulkDelete = useMutation({
		mutationFn: unknownWordApi.bulkDelete,
		onSuccess: invalidate,
	});

	const addToDictionary = useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: AddToDictionaryPayload;
		}) => unknownWordApi.addToDictionary(id, payload),
		onSuccess: invalidate,
	});

	const linkToLemma = useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: LinkToLemmaPayload;
		}) => unknownWordApi.linkToLemma(id, payload),
		onSuccess: invalidate,
	});

	return {
		remove,
		clearAll,
		bulkDelete,
		addToDictionary,
		linkToLemma,
	};
};
