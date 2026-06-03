// Types
export type {
  UserTextType,
  UserTextLanguage,
  UserTextListItem,
  UserText,
  CreateUserTextDto,
  UpdateUserTextDto,
  GetUserTextsParams,
  UserTextsMeta,
  UserTextsListResponse,
} from "./api/types";

// API
export { userTextApi } from "./api/user-text-api";

// Query options + keys + mutation hooks
export {
  userTextKeys,
  userTextListQueryOptions,
  userTextDetailQueryOptions,
  useCreateUserText,
  useUpdateUserText,
  useDeleteUserText,
} from "./model/queries";
