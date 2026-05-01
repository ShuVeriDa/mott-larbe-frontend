"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/shared/api";
import { dictionaryKeys } from "@/entities/dictionary";
import { textKeys } from "@/entities/text";
import { wordKeys } from "@/entities/word";
import type { LearningLevel } from "@/shared/types";

interface UpdateLearnStatusVars {
	lemmaId: string;
	status: LearningLevel;
	tokenId?: string;
	textId?: string;
}

export const useUpdateLearnStatus = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ lemmaId, status }: UpdateLearnStatusVars) => {
			const { data } = await http.patch(
				`/progress/words/${lemmaId}/status`,
				{ status },
			);
			return data;
		},
		onSuccess: (_, variables) => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
			if (variables.tokenId) {
				qc.invalidateQueries({ queryKey: wordKeys.lookup(variables.tokenId) });
			}
			if (variables.textId) {
				qc.invalidateQueries({
					queryKey: textKeys.progress(variables.textId),
				});
			}
		},
	});
};
