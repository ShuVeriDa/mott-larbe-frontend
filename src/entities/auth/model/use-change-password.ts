"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import type { ChangePasswordDto } from "../api";

export const useChangePassword = () =>
	useMutation({
		mutationFn: (body: ChangePasswordDto) => authApi.changePassword(body),
	});
