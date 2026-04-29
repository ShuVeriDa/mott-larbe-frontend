import { QueryClient } from "@tanstack/react-query";

export const makeQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
				gcTime: 5 * 60 * 1000,
				refetchOnWindowFocus: false,
			},
			mutations: {
				retry: false,
			},
		},
	});
