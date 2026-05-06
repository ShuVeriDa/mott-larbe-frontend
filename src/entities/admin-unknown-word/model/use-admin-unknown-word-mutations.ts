"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUnknownWordApi } from "../api/admin-unknown-word-api";
import { adminUnknownWordKeys } from "../api/admin-unknown-word-keys";
import type { AddToDictionaryDto } from "../api/types";

export const useAdminUnknownWordMutations = () => {
	const qc = useQueryClient();
	const invalidateAll = () =>
		qc.invalidateQueries({ queryKey: adminUnknownWordKeys.root });

	const addToDictionary = useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: AddToDictionaryDto;
		}) => adminUnknownWordApi.addToDictionary(id, payload),
		onSuccess: invalidateAll,
	});

	const linkToLemma = useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: { lemmaId: string };
		}) => adminUnknownWordApi.link(id, payload.lemmaId),
		onSuccess: invalidateAll,
	});

	const remove = useMutation({
		mutationFn: adminUnknownWordApi.deleteOne,
		onSuccess: invalidateAll,
	});

	const clearAll = useMutation({
		mutationFn: adminUnknownWordApi.deleteAll,
		onSuccess: invalidateAll,
	});

	const bulkDelete = useMutation({
		mutationFn: adminUnknownWordApi.bulkDelete,
		onSuccess: invalidateAll,
	});

	return { addToDictionary, linkToLemma, remove, clearAll, bulkDelete };
};
