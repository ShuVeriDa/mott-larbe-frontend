"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewApi, reviewKeys } from "../api";

export const useReviewDue = (limit?: number) =>
	useQuery({
		queryKey: reviewKeys.due(limit),
		queryFn: () => reviewApi.due(limit),
	});
