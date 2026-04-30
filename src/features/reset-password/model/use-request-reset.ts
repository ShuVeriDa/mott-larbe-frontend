"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi, type RequestPasswordResetDto } from "@/entities/auth";

export const useRequestReset = () =>
	useMutation({
		mutationFn: (body: RequestPasswordResetDto) =>
			authApi.requestPasswordReset(body),
	});
