"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewApi, reviewKeys } from "../api";

export const useReviewStats = () =>
	useQuery({
		queryKey: reviewKeys.stats(),
		queryFn: () => reviewApi.stats(),
	});
