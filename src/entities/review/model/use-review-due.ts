"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { reviewApi, reviewKeys } from "../api";

export const useReviewDue = (limit?: number) =>
	useQuery({
		queryKey: reviewKeys.due(limit),
		queryFn: () => reviewApi.due(limit),
	});

export const useSuspenseReviewDue = (limit: number) =>
	useSuspenseQuery({
		queryKey: reviewKeys.due(limit),
		queryFn: () => reviewApi.due(limit),
	});
