"use client";

import { useQuery } from "@tanstack/react-query";
import { dictionaryApi, dictionaryKeys } from "../api";

export const useDueWords = () =>
	useQuery({
		queryKey: dictionaryKeys.due(),
		queryFn: () => dictionaryApi.due(),
	});
