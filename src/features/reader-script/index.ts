export {
	useReaderScript,
	useReaderScriptAvailability,
	type ReaderScript,
	type ReaderOrthography,
} from "./model";
export { ScriptSwitcher } from "./ui/script-switcher";
export { ArabicScriptLabel } from "./ui/arabic-script-label";
export { MottLarbeLabel } from "./ui/mott-larbe-label";
export { DiacriticsToggle } from "./ui/diacritics-toggle";
export { OrthographyToggle } from "./ui/orthography-toggle";
export { OrthographyPreviewToggle } from "./ui/orthography-preview-toggle";
export { ScriptVersionsPanel } from "./ui/script-versions-panel";
export { stripArabicDiacritics, stripDiacriticsFromDoc } from "./lib/strip-diacritics";
export { SCRIPT_OPTIONS, type ScriptOption } from "./lib/script-options";
