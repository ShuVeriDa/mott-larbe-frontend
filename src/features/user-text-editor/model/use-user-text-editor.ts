"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { TipTapDoc } from "@/shared/ui/notion-editor";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useDebounce } from "@/shared/lib/debounce";
import {
  useCreateUserText,
  useUpdateUserText,
  type UserText,
  type UserTextLanguage,
  type UserTextType,
} from "@/entities/user-text";
import type { UserTextFieldErrors, UserTextFormState } from "./types";

const EMPTY_DOC: TipTapDoc = { type: "doc", content: [] };
const CONTENT_WARN_BYTES = 400_000;

export interface UseUserTextEditorProps {
  mode: "create" | "edit";
  initial?: UserText;
  /** Called after successful save with the saved id — used for redirect */
  onSaved?: (id: string) => void;
  /** Lang segment for redirects, e.g. "che" */
  lang: string;
}

export const useUserTextEditor = ({
  mode,
  initial,
  onSaved,
  lang,
}: UseUserTextEditorProps) => {
  const { t } = useI18n();
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const createMutation = useCreateUserText();
  const updateMutation = useUpdateUserText();

  // ─── Form state ──────────────────────────────────────────────────────────

  const [title, setTitle] = useState(initial?.title ?? "");
  const [language, setLanguage] = useState<UserTextLanguage>(
    initial?.language ?? "CHE",
  );
  const [type, setType] = useState<UserTextType>(initial?.type ?? "EXTERNAL");
  const [author, setAuthor] = useState(initial?.author ?? "");
  const [sourceUrl, setSourceUrl] = useState(initial?.sourceUrl ?? "");
  const [content, setContent] = useState<TipTapDoc>(
    initial?.content ?? EMPTY_DOC,
  );
  const [fieldErrors, setFieldErrors] = useState<UserTextFieldErrors>({});

  // Track last saved content for unsaved-changes detection
  const lastSavedContentRef = useRef<TipTapDoc>(initial?.content ?? EMPTY_DOC);
  const savedIdRef = useRef<string | null>(initial?.id ?? null);

  // ─── Content size warning ─────────────────────────────────────────────────

  const contentBytes = JSON.stringify(content).length;
  const isContentTooLarge = contentBytes > CONTENT_WARN_BYTES;

  // ─── Unsaved changes guard ────────────────────────────────────────────────
  // Valid useEffect use case: external browser API (beforeunload)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasUnsaved =
        JSON.stringify(content) !==
        JSON.stringify(lastSavedContentRef.current);
      if (hasUnsaved) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [content]);

  // ─── Auto-save (edit mode only) ───────────────────────────────────────────
  // Debounced 30s — only fires in edit mode after the record exists

  const debouncedContent = useDebounce(content, 30_000);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  useEffect(() => {
    const id = savedIdRef.current;
    if (mode !== "edit" || !id) return;

    const isSame =
      JSON.stringify(debouncedContent) ===
      JSON.stringify(lastSavedContentRef.current);
    if (isSame) return;

    setAutoSaveStatus("saving");
    updateMutation.mutate(
      { id, dto: { content: debouncedContent } },
      {
        onSuccess: () => {
          lastSavedContentRef.current = debouncedContent;
          setAutoSaveStatus("saved");
        },
        onError: () => {
          setAutoSaveStatus("error");
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent]);

  // ─── Client-side validation ───────────────────────────────────────────────

  const validate = (): boolean => {
    const errors: UserTextFieldErrors = {};

    if (!title.trim()) {
      errors.title = t("myTexts.validation.titleRequired");
    }

    if (
      sourceUrl &&
      !/^https?:\/\//.test(sourceUrl)
    ) {
      errors.sourceUrl = t("myTexts.validation.sourceUrlInvalid");
    }

    if (isContentTooLarge) {
      errors.content = t("myTexts.validation.contentTooLarge");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── Submit handlers ──────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return;

    const dto = {
      title: title.trim(),
      language,
      type,
      author: type === "ORIGINAL" ? undefined : author || undefined,
      sourceUrl: sourceUrl || undefined,
      content,
    };

    if (mode === "create") {
      createMutation.mutate(dto, {
        onSuccess: (data) => {
          savedIdRef.current = data.id;
          lastSavedContentRef.current = content;
          success(t("myTexts.createSuccess"));
          if (onSaved) {
            onSaved(data.id);
          } else {
            router.push(`/${lang}/my-texts/${data.id}`);
          }
        },
        onError: () => {
          toastError(t("myTexts.createError"));
        },
      });
    } else {
      const id = savedIdRef.current;
      if (!id) return;

      updateMutation.mutate(
        { id, dto },
        {
          onSuccess: (data) => {
            lastSavedContentRef.current = content;
            setAutoSaveStatus("saved");
            success(t("myTexts.editSuccess"));
            if (onSaved) {
              onSaved(data.id);
            } else {
              router.push(`/${lang}/my-texts/${data.id}`);
            }
          },
          onError: () => {
            toastError(t("myTexts.editError"));
          },
        },
      );
    }
  };

  // ─── Named handlers (CLAUDE.md: never inline in JSX) ─────────────────────

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
    if (fieldErrors.title) setFieldErrors((p) => ({ ...p, title: undefined }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.currentTarget.value as UserTextLanguage);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.currentTarget.value as UserTextType);
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.currentTarget.value);
  };

  const handleSourceUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSourceUrl(e.currentTarget.value);
    if (fieldErrors.sourceUrl)
      setFieldErrors((p) => ({ ...p, sourceUrl: undefined }));
  };

  const handleContentUpdate = (doc: TipTapDoc) => {
    setContent(doc);
    if (fieldErrors.content)
      setFieldErrors((p) => ({ ...p, content: undefined }));
  };

  const isPending =
    createMutation.isPending || updateMutation.isPending;

  return {
    t,
    // Form state
    title,
    language,
    type,
    author,
    sourceUrl,
    content,
    fieldErrors,
    isContentTooLarge,
    contentBytes,
    autoSaveStatus,
    isPending,
    mode,
    // Handlers
    handleTitleChange,
    handleLanguageChange,
    handleTypeChange,
    handleAuthorChange,
    handleSourceUrlChange,
    handleContentUpdate,
    handleSubmit,
  };
};
