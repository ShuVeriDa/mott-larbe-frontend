"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { reviewApi, reviewKeys } from "../api";

export const useReviewStats = () =>
	useQuery({
		queryKey: reviewKeys.stats(),
		queryFn: () => reviewApi.stats(),
	});

export const useSuspenseReviewStats = () =>
	useSuspenseQuery({
		queryKey: reviewKeys.stats(),
		queryFn: () => reviewApi.stats(),
	});
