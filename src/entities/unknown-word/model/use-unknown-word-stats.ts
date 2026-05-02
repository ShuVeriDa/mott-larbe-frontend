"use client";

import { useQuery } from "@tanstack/react-query";
import { unknownWordApi } from "../api/unknown-word-api";
import { unknownWordKeys } from "../api/unknown-word-keys";

export const useUnknownWordStats = () =>
	useQuery({
		queryKey: unknownWordKeys.stats(),
		queryFn: unknownWordApi.stats,
	});
