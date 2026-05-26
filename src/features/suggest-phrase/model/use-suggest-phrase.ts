"use client";

import { phrasebookApi, type SuggestPhraseDto } from "@/entities/phrasebook";
import { useMutation } from "@tanstack/react-query";

export const useSuggestPhrase = () =>
	useMutation({
		mutationFn: (body: SuggestPhraseDto) => phrasebookApi.suggest(body),
	});
