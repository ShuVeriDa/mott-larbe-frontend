export {
	useReaderScript,
	useReaderScriptAvailability,
	type ReaderScript,
} from "./model";
export { ScriptSwitcher } from "./ui/script-switcher";
export { DiacriticsToggle } from "./ui/diacritics-toggle";
export { ScriptVersionsPanel } from "./ui/script-versions-panel";
export { stripArabicDiacritics, stripDiacriticsFromDoc } from "./lib/strip-diacritics";
export { SCRIPT_OPTIONS, type ScriptOption } from "./lib/script-options";
