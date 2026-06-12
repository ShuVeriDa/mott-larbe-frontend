import type { ChScript } from "./types";

export const textScriptVersionKeys = {
	root: ["text-script-version"] as const,
	versions: (textId: string) =>
		["text-script-version", "versions", textId] as const,
	userVersions: (userTextId: string) =>
		["text-script-version", "user-versions", userTextId] as const,
	page: (textId: string, pageNumber: number, script: ChScript) =>
		["text-script-version", "page", textId, pageNumber, script] as const,
	userPage: (userTextId: string, pageNumber: number, script: ChScript) =>
		["text-script-version", "user-page", userTextId, pageNumber, script] as const,
};
