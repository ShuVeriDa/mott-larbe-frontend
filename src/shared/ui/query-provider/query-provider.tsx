"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/shared/lib/query-client";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
	const [queryClient] = useState(() => makeQueryClient());

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
