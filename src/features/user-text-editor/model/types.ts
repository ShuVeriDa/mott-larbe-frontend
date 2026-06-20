import type { TipTapDoc } from "@/shared/ui/notion-editor";
import type { UserTextLanguage, UserTextType } from "@/entities/user-text";

// Shared across hook + form components

export interface UserTextFormState {
  title: string;
  language: UserTextLanguage;
  type: UserTextType;
  author: string;
  sourceUrl: string;
  content: TipTapDoc;
}

export interface UserTextFieldErrors {
  title?: string;
  sourceUrl?: string;
  content?: string;
  language?: string;
}
