"use client";

import { useMutation } from "@tanstack/react-query";
import { settingsApi } from "../api";

export const useDeleteAccount = () =>
	useMutation({
		mutationFn: (confirmEmail: string) =>
			settingsApi.deleteAccount(confirmEmail),
	});
