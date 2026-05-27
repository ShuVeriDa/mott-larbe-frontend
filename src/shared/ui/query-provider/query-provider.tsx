"use client";

import { ReactNode, useState } from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient, makeQueryClient } from "@/shared/lib/query-client";

export const QueryProvider = ({ children }: { children: ReactNode }) => {
	const [queryClient] = useState(() =>
		typeof window === "undefined" ? getQueryClient() : makeQueryClient(),
	);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
