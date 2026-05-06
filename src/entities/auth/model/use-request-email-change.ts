"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import type { EmailChangeRequestDto } from "../api";

export const useRequestEmailChange = () =>
	useMutation({
		mutationFn: (body: EmailChangeRequestDto) => authApi.requestEmailChange(body),
	});
