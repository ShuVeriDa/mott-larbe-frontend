"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userPrivacyApi } from "../api/user-privacy-api";
import { userPrivacyKeys } from "../api/user-privacy-keys";
import type { UpdatePrivacyDto, UserPrivacySettings } from "../api/types";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";

export const useUpdatePrivacy = () => {
	const queryClient = useQueryClient();
	const { toastApiError } = useApiErrorToast();
	const { success } = useToast();
	const { t } = useI18n();

	return useMutation({
		mutationFn: (dto: UpdatePrivacyDto) => userPrivacyApi.updateMyPrivacy(dto),
		onMutate: async (dto) => {
			await queryClient.cancelQueries({ queryKey: userPrivacyKeys.my() });
			const previous = queryClient.getQueryData<UserPrivacySettings>(
				userPrivacyKeys.my(),
			);
			if (previous) {
				queryClient.setQueryData<UserPrivacySettings>(userPrivacyKeys.my(), {
					...previous,
					...dto,
				});
			}
			return { previous };
		},
		onSuccess: () => {
			success(t("profile.toasts.saved"));
		},
		onError: (_err, _dto, ctx) => {
			if (ctx?.previous) {
				queryClient.setQueryData(userPrivacyKeys.my(), ctx.previous);
			}
			toastApiError(_err);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: userPrivacyKeys.my() });
		},
	});
};
