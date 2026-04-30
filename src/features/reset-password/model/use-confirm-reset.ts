"use client";

import { useMutation } from "@tanstack/react-query";
import {
	authApi,
	type AuthLang,
	type ConfirmPasswordResetDto,
} from "@/entities/auth";

interface ConfirmResetVariables {
	body: ConfirmPasswordResetDto;
	lang?: AuthLang;
}

export const useConfirmReset = () =>
	useMutation({
		mutationFn: ({ body, lang }: ConfirmResetVariables) =>
			authApi.confirmPasswordReset(body, lang),
	});
