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
	SpellingOccurrence,
	PaginatedSpellingOccurrences,
	SpellingOccurrenceTextOption,
	FetchSpellingOccurrencesParams,
	FetchSpellingOccurrenceTextsParams,
	FixOccurrencesPayload,
	FixOccurrencesResult,
	FindReplaceOccurrencesParams,
	FindReplaceTextsParams,
} from "./api";
export {
	spellingDictionaryQueryOptions,
	adminSpellingDictionaryQueryOptions,
	spellingOccurrencesQueryOptions,
	spellingOccurrenceTextsQueryOptions,
	findReplaceOccurrencesQueryOptions,
	findReplaceTextsQueryOptions,
	useSpellingDictionary,
	useAdminSpellingDictionary,
	useCreateSpellingEntry,
	useUpdateSpellingEntry,
	useDeleteSpellingEntry,
	useFixOccurrences,
} from "./model";
export {
	SpellingOccurrenceItem,
	SpellingOccurrenceCard,
	SpellingOccurrencesList,
	SpellingOccurrencesPagination,
	SpellingOccurrenceTextFilter,
	SpellingFixBar,
	SpellingFixConfirmDialog,
} from "./ui";
