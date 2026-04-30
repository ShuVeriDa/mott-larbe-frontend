"use client";

import { useQuery } from "@tanstack/react-query";
import { dictionaryApi, dictionaryKeys } from "../api";

export const useDictionaryStats = () =>
	useQuery({
		queryKey: dictionaryKeys.stats(),
		queryFn: () => dictionaryApi.stats(),
	});
