"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tokenizationApi } from "../api/token-api";
import { tokenizationKeys } from "../api/token-keys";
import type { RunTokenizationDto } from "../api/types";

export const useTokenizationMutations = () => {
	const qc = useQueryClient();

	const invalidate = () => {
		qc.invalidateQueries({ queryKey: tokenizationKeys.root });
	};

	const run = useMutation({
		mutationFn: (dto: RunTokenizationDto) => tokenizationApi.run(dto),
		onSuccess: invalidate,
	});

	const runText = useMutation({
		mutationFn: (textId: string) => tokenizationApi.runText(textId),
		onSuccess: invalidate,
	});

	const cancelText = useMutation({
		mutationFn: (textId: string) => tokenizationApi.cancelText(textId),
		onSuccess: invalidate,
	});

	const resetText = useMutation({
		mutationFn: (textId: string) => tokenizationApi.resetText(textId),
		onSuccess: invalidate,
	});

	const bulkRun = useMutation({
		mutationFn: (textIds: string[]) => tokenizationApi.bulkRun(textIds),
		onSuccess: invalidate,
	});

	const bulkReset = useMutation({
		mutationFn: (textIds: string[]) => tokenizationApi.bulkReset(textIds),
		onSuccess: invalidate,
	});

	return { run, runText, cancelText, resetText, bulkRun, bulkReset };
};
