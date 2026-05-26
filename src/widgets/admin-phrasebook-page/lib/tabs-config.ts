import type { AdminPhrasebookTab } from "../model/types";

export const TABS_CONFIG: { key: AdminPhrasebookTab; labelKey: string }[] = [
	{ key: "categories", labelKey: "adminPhrasebook.tabs.categories" },
	{ key: "phrases", labelKey: "adminPhrasebook.tabs.phrases" },
	{ key: "suggestions", labelKey: "adminPhrasebook.tabs.suggestions" },
];
