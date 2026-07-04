"use client";

import { useQuery, queryOptions } from "@tanstack/react-query";
import { featureFlagsApi } from "./feature-flags-api";

// Short staleTime: access can be granted/revoked by an admin at any moment
// (per-user override) and the UI must reflect that promptly, not cache it away.
const STALE_TIME = 1000 * 30;

const featureFlagQueryOptions = (key: string, enabled: boolean) =>
	queryOptions({
		queryKey: ["feature-flags", "me", key] as const,
		queryFn: async () => (await featureFlagsApi.getMyFlags([key]))[key] ?? false,
		staleTime: STALE_TIME,
		// Anonymous visitors would get 401 here (endpoint requires auth) — the
		// shared `http` client's 401 interceptor redirects to /auth on non-public
		// pages, so this must stay opt-in via `isAuthenticated` rather than firing
		// unconditionally for every guest viewing a public page.
		enabled,
		retry: false,
	});

/**
 * Resolves whether `key` is enabled for the current user.
 * Pass `isAuthenticated` from the caller (e.g. `useCurrentUser()` at the
 * widget/feature layer) — this hook lives in `shared` and cannot depend on
 * the `entities/user` layer itself, so it can't determine auth state on its own.
 */
export const useFeatureFlag = (key: string, isAuthenticated: boolean): boolean => {
	const { data } = useQuery(featureFlagQueryOptions(key, isAuthenticated));
	return data ?? false;
};
