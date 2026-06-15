export { spellingDictionaryApi, spellingDictionaryKeys } from "./api";
export type {
	SpellingEntry,
	AdminSpellingEntry,
	PaginatedSpellingEntries,
	CreateSpellingEntryPayload,
	UpdateSpellingEntryPayload,
	FetchSpellingEntriesParams,
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
