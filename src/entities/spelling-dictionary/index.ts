export { spellingDictionaryApi, spellingDictionaryKeys } from "./api";
export type { CorrectFormNode } from "./lib";
export {
	parseCorrectForm,
	serializeCorrectForm,
	getCorrectFormPlainText,
	correctFormHasSuperscript,
	buildMatchRegex,
} from "./lib";
export type {
	SpellingEntry,
	AdminSpellingEntry,
	PaginatedSpellingEntries,
	CreateSpellingEntryPayload,
	UpdateSpellingEntryPayload,
	FetchSpellingEntriesParams,
	SpellingMatchType,
} from "./api";
export {
	spellingDictionaryQueryOptions,
	adminSpellingDictionaryQueryOptions,
	useSpellingDictionary,
	useAdminSpellingDictionary,
	useCreateSpellingEntry,
	useUpdateSpellingEntry,
	useDeleteSpellingEntry,
} from "./model";
