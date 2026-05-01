export const settingsKeys = {
	root: ["settings"] as const,
	all: () => ["settings", "all"] as const,
};
