// Form component — heavy bundle (TipTap). Only import on editor routes.
// Do NOT include this barrel in list/reader page imports.
export { UserTextEditorForm } from "./ui/user-text-editor-form";

// Hook — can be used independently if needed
export { useUserTextEditor } from "./model/use-user-text-editor";
export type { UseUserTextEditorProps } from "./model/use-user-text-editor";

// Types
export type {
  UserTextFormState,
  UserTextFieldErrors,
} from "./model/types";
