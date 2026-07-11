import type { ReaderScript } from "../model";

// Site name "Мотт ларбе" spelled per script + orthography, used as a live
// preview on the script-switch buttons so users see the orthography in action.
export const MOTT_LARBE_LABEL: Record<Exclude<ReaderScript, "ARABIC">, { new: string; old: string }> = {
	CYRILLIC: { new: "Мотт ларбе", old: "Муотт ларбиэ" },
	LATIN: { new: "Muott larbe", old: "Muott larbie" },
};
