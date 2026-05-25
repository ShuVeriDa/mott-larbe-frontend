"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deckApi, deckKeys } from "../api";
import type { UpdateDeckSettingsBody } from "../api";

export const useUpdateDeckSettings = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UpdateDeckSettingsBody) => deckApi.updateSettings(body),
		onSuccess: (updated) => {
			queryClient.setQueryData(deckKeys.settings(), updated);
		},
	});
};
