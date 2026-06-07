"use client";

import dynamic from "next/dynamic";
import { ReviewPageSkeleton } from "./review-page-skeleton";

export const ReviewPageClient = dynamic(
	() => import("./review-page").then((m) => ({ default: m.ReviewPage })),
	{ ssr: false, loading: () => <ReviewPageSkeleton /> },
);
