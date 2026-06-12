import type { ReaderScript } from "../model";

export interface ScriptOption {
	value: ReaderScript;
	fullKey: string;
	shortKey: string;
}

export const SCRIPT_OPTIONS: ScriptOption[] = [
	{ value: "CYRILLIC", fullKey: "reader.settings.script.cyrillic", shortKey: "reader.settings.script.cyrillicShort" },
	{ value: "LATIN",    fullKey: "reader.settings.script.latin",    shortKey: "reader.settings.script.latinShort" },
	{ value: "ARABIC",   fullKey: "reader.settings.script.arabic",   shortKey: "reader.settings.script.arabicShort" },
];
