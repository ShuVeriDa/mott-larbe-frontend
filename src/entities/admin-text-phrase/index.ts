export { adminTextPhraseApi } from "./api/admin-text-phrase-api";
export { adminTextPhraseKeys } from "./api/admin-text-phrase-keys";
export type {
  TextPhrase,
  TextPhraseOccurrence,
  TextPhraseWithOccurrences,
  PagePhraseOccurrence,
  CreatePhraseAutoOccurrenceDto,
  CreatePhraseWithOccurrenceDto,
  CreateTextPhraseDto,
  UpdateTextPhraseDto,
  CreateTextPhraseOccurrenceDto,
  PhraseLanguage,
} from "./api/types";
export {
  useAdminPagePhrases,
  useCreatePhraseWithOccurrence,
  useDeletePhraseOccurrence,
  useUpdatePhrase,
} from "./model/use-admin-page-phrases";
