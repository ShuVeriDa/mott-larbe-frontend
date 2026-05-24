"use client";

import { Suspense } from "react";
import { usePageAnalytics } from "./use-page-analytics";

const PageAnalyticsInner = () => {
	usePageAnalytics();
	return null;
};

export const PageAnalyticsProvider = () => (
	<Suspense>
		<PageAnalyticsInner />
	</Suspense>
);
