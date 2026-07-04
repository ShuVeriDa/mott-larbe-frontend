import type { TipTapDoc } from "@/shared/ui/notion-editor";
import type { AppLanguage } from "@/shared/lib/languages";

export type UserTextType = "ORIGINAL" | "EXTERNAL";

export type UserTextLanguage = AppLanguage;

// List item — content (TipTap JSON) excluded to keep list payloads small.
// Used by card components and list queries.
export interface UserTextListItem {
  id: string;
  userId: string;
  title: string;
  language: UserTextLanguage;
  author: string | null;
  sourceUrl: string | null;
  type: UserTextType;
  createdAt: string;
  updatedAt: string;
}

// Full item — includes TipTap content. Only returned by GET /user-texts/:id.
export interface UserText extends UserTextListItem {
  content: TipTapDoc;
}

export interface CreateUserTextDto {
  title: string;
  language: UserTextLanguage;
  type: UserTextType;
  author?: string;
  sourceUrl?: string;
  content: TipTapDoc;
}

export interface UpdateUserTextDto {
  title?: string;
  language?: UserTextLanguage;
  type?: UserTextType;
  author?: string;
  sourceUrl?: string;
  content?: TipTapDoc;
}

export interface GetUserTextsParams {
  type?: UserTextType;
  limit?: number;
  offset?: number;
}

export interface UserTextsMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface UserTextsListResponse {
  data: UserTextListItem[];
  meta: UserTextsMeta;
}
