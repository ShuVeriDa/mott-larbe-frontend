"use client";

import { useQuery } from "@tanstack/react-query";
import { dictionaryApi, dictionaryKeys } from "../api";

export const useDictionaryDetail = (id: string | undefined) =>
	useQuery({
		queryKey: id ? dictionaryKeys.detail(id) : ["dictionary", "detail", "_"],
		queryFn: () => dictionaryApi.detail(id as string),
		enabled: Boolean(id),
	});
