// Heavy bundle (TipTap) — only import on editor routes
export { SubmissionEditorForm } from "./ui/submission-editor-form";

// Hooks
export { useSubmissionEditor } from "./model/use-submission-editor";
export type { UseSubmissionEditorProps, SubmissionFormFieldErrors } from "./model/use-submission-editor";
export { useCopyFromUserText } from "./model/use-copy-from-user-text";
export { useInitialFromUserText } from "./model/use-initial-from-user-text";
