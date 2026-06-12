"use client";

import type { TextScriptVersionInfo } from "@/entities/text-script-version";
import type { ReaderScript } from "./reader-script-store";

export const useReaderScriptAvailability = (
	versions: TextScriptVersionInfo[],
): ReaderScript[] => {
	const available: ReaderScript[] = ["CYRILLIC"];

	for (const v of versions) {
		if (v.status === "COMPLETED") {
			available.push(v.script as ReaderScript);
		}
	}

	return available;
};
