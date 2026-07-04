import { http } from "@/shared/api";

export const featureFlagsApi = {
	getMyFlags: (keys: string[]) =>
		http
			.get<Record<string, boolean>>("/feature-flags/me", { params: { keys: keys.join(",") } })
			.then(r => r.data),
};
