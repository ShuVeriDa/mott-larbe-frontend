"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { TipTapDoc } from "@/shared/ui/notion-editor";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useDebounce } from "@/shared/lib/debounce";
import {
  useCreateTextSubmission,
  useUpdateTextSubmission,
  useSubmitTextSubmission,
  useOwnedTextSubmission,
  type SubmissionLicenseType,
  type SubmissionType,
  type TextSubmission,
} from "@/features/text-submission";

const EMPTY_DOC: TipTapDoc = { type: "doc", content: [] };
const CONTENT_WARN_BYTES = 400_000;

export interface SubmissionFormFieldErrors {
  title?: string;
  sourceUrl?: string;
  licenseType?: string;
  contentRich?: string;
}

export interface UseSubmissionEditorProps {
  mode: "create" | "edit";
  /** In edit mode — the draft submission id to load */
  draftId?: string;
  /** Pre-filled values (from copy-from-UserText flow) */
  initial?: Partial<{
    title: string;
    language: string;
    submissionType: SubmissionType;
    author: string;
    sourceUrl: string;
    contentRich: TipTapDoc;
  }>;
  lang: string;
  onSaved?: (id: string) => void;
}

export const useSubmissionEditor = ({
  mode,
  draftId,
  initial,
  lang,
  onSaved,
}: UseSubmissionEditorProps) => {
  const { t } = useI18n();
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const createMutation = useCreateTextSubmission();
  const updateMutation = useUpdateTextSubmission();
  const submitMutation = useSubmitTextSubmission();

  // Load existing draft in edit mode
  const draftQuery = useOwnedTextSubmission(draftId ?? "");
  const existingDraft: TextSubmission | undefined =
    mode === "edit" && draftId ? draftQuery.data : undefined;

  // ─── Form state ──────────────────────────────────────────────────────────

  const [title, setTitle] = useState(
    () => initial?.title ?? existingDraft?.title ?? "",
  );
  const [language, setLanguage] = useState(
    () => initial?.language ?? existingDraft?.language ?? "CHE",
  );
  const [submissionType, setSubmissionType] = useState<SubmissionType>(
    () => initial?.submissionType ?? existingDraft?.submissionType ?? "EXTERNAL",
  );
  const [author, setAuthor] = useState(
    () => initial?.author ?? existingDraft?.author ?? "",
  );
  const [sourceUrl, setSourceUrl] = useState(
    () => initial?.sourceUrl ?? existingDraft?.sourceUrl ?? "",
  );
  const [licenseType, setLicenseType] = useState<SubmissionLicenseType | "">(
    () => existingDraft?.licenseType ?? "",
  );
  const [publicationYear, setPublicationYear] = useState<string>(
    () => existingDraft?.publicationYear?.toString() ?? "",
  );
  const [contentRich, setContentRich] = useState<TipTapDoc>(
    () => initial?.contentRich ?? existingDraft?.contentRich ?? EMPTY_DOC,
  );
  const [fieldErrors, setFieldErrors] = useState<SubmissionFormFieldErrors>({});
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  // UI-only fields (stored locally, not yet persisted to TextSubmission schema)
  const [description, setDescription] = useState("");
  const [genreId, setGenreId] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [pageTitles, setPageTitles] = useState<string[]>([""]);
  const [activePage] = useState(0);

  // Sync state when draft loads (edit mode)
  useEffect(() => {
    if (!existingDraft) return;
    setTitle(existingDraft.title);
    setLanguage(existingDraft.language);
    setSubmissionType(existingDraft.submissionType ?? "EXTERNAL");
    setAuthor(existingDraft.author ?? "");
    setSourceUrl(existingDraft.sourceUrl ?? "");
    setLicenseType(existingDraft.licenseType ?? "");
    setPublicationYear(existingDraft.publicationYear?.toString() ?? "");
    if (existingDraft.contentRich) setContentRich(existingDraft.contentRich);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingDraft?.id]);

  // ─── Derived ─────────────────────────────────────────────────────────────

  const isExternal = submissionType === "EXTERNAL";
  const contentBytes = JSON.stringify(contentRich).length;
  const isContentTooLarge = contentBytes > CONTENT_WARN_BYTES;
  const savedIdRef = useRef<string | null>(draftId ?? null);
  const lastSavedContentRef = useRef<TipTapDoc>(
    initial?.contentRich ?? existingDraft?.contentRich ?? EMPTY_DOC,
  );

  // ─── Auto-save (edit mode only) ───────────────────────────────────────────

  const debouncedContent = useDebounce(contentRich, 30_000);
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
      { id, dto: { contentRich: debouncedContent } },
      {
        onSuccess: () => {
          lastSavedContentRef.current = debouncedContent;
          setAutoSaveStatus("saved");
        },
        onError: () => setAutoSaveStatus("error"),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent]);

  // ─── Unsaved changes guard ────────────────────────────────────────────────

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasUnsaved =
        JSON.stringify(contentRich) !==
        JSON.stringify(lastSavedContentRef.current);
      if (hasUnsaved) e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [contentRich]);

  // ─── Validation ───────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const errors: SubmissionFormFieldErrors = {};
    if (!title.trim()) errors.title = t("myTexts.validation.titleRequired");
    if (sourceUrl && !/^https?:\/\//.test(sourceUrl))
      errors.sourceUrl = t("myTexts.validation.sourceUrlInvalid");
    if (isExternal && !licenseType)
      errors.licenseType = t("myTexts.validation.licenseRequired");
    if (isContentTooLarge)
      errors.contentRich = t("myTexts.validation.contentTooLarge");
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── Save draft (create or update) ───────────────────────────────────────

  const handleSaveDraft = () => {
    if (!validate()) return;

    const dto = {
      title: title.trim(),
      language,
      submissionType,
      author: submissionType === "ORIGINAL" ? undefined : author || undefined,
      sourceUrl: sourceUrl || undefined,
      licenseType: isExternal && licenseType ? licenseType : undefined,
      publicationYear:
        isExternal && publicationYear ? parseInt(publicationYear, 10) : undefined,
      contentRich,
      status: "DRAFT" as const,
    };

    if (mode === "create") {
      createMutation.mutate(dto, {
        onSuccess: (data) => {
          savedIdRef.current = data.id;
          lastSavedContentRef.current = contentRich;
          success(t("myTexts.submit.draftSaved"));
          if (onSaved) {
            onSaved(data.id);
          } else {
            router.push(`/${lang}/my-texts/submit/${data.id}/edit`);
          }
        },
        onError: () => toastError(t("myTexts.submit.saveError")),
      });
    } else {
      const id = savedIdRef.current;
      if (!id) return;
      updateMutation.mutate(
        { id, dto },
        {
          onSuccess: () => {
            lastSavedContentRef.current = contentRich;
            setAutoSaveStatus("saved");
            success(t("myTexts.submit.draftSaved"));
          },
          onError: () => toastError(t("myTexts.submit.saveError")),
        },
      );
    }
  };

  // ─── Submit for moderation (DRAFT → PENDING) ─────────────────────────────

  const handleRequestSubmit = () => {
    if (!validate()) return;
    setShowSubmitConfirm(true);
  };

  const handleConfirmSubmit = () => {
    const id = savedIdRef.current;
    if (!id) return;
    setShowSubmitConfirm(false);
    submitMutation.mutate(id, {
      onSuccess: () => {
        success(t("myTexts.submit.success"));
        router.push(`/${lang}/my-texts`);
      },
      onError: () => toastError(t("myTexts.submit.error")),
    });
  };

  const handleCancelSubmit = () => setShowSubmitConfirm(false);

  // ─── Named handlers ───────────────────────────────────────────────────────

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
    if (fieldErrors.title) setFieldErrors((p) => ({ ...p, title: undefined }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.currentTarget.value);
  };

  const handleSubmissionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubmissionType(e.currentTarget.value as SubmissionType);
    // Clear license errors when switching away from EXTERNAL
    if (e.currentTarget.value !== "EXTERNAL")
      setFieldErrors((p) => ({ ...p, licenseType: undefined }));
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.currentTarget.value);
  };

  const handleSourceUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSourceUrl(e.currentTarget.value);
    if (fieldErrors.sourceUrl)
      setFieldErrors((p) => ({ ...p, sourceUrl: undefined }));
  };

  const handleLicenseTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLicenseType(e.currentTarget.value as SubmissionLicenseType);
    if (fieldErrors.licenseType)
      setFieldErrors((p) => ({ ...p, licenseType: undefined }));
  };

  const handlePublicationYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPublicationYear(e.currentTarget.value);
  };

  const handleContentUpdate = (doc: TipTapDoc) => {
    setContentRich(doc);
    if (fieldErrors.contentRich)
      setFieldErrors((p) => ({ ...p, contentRich: undefined }));
  };

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    submitMutation.isPending;

  const isLoadingDraft = mode === "edit" && draftId ? draftQuery.isPending : false;

  // UI-only handlers (not yet persisted to backend)
  const handleDescriptionChange = (v: string) => setDescription(v);
  const handleGenreChange = (v: string | null) => setGenreId(v);
  const handleCoverSelect = (file: File) => setCoverPreviewUrl(URL.createObjectURL(file));
  const handleCoverRemove = () => setCoverPreviewUrl(null);
  const handlePageTitleChange = (value: string) => {
    setPageTitles(prev => prev.map((t, i) => i === activePage ? value : t));
  };

  return {
    t,
    // State
    title,
    language,
    submissionType,
    author,
    sourceUrl,
    licenseType,
    publicationYear,
    contentRich,
    fieldErrors,
    isExternal,
    isContentTooLarge,
    autoSaveStatus,
    showSubmitConfirm,
    isPending,
    isLoadingDraft,
    mode,
    // UI-only extended fields
    description,
    genreId,
    coverPreviewUrl,
    pageTitles,
    activePage,
    // Handlers
    handleTitleChange,
    handleLanguageChange,
    handleSubmissionTypeChange,
    handleAuthorChange,
    handleSourceUrlChange,
    handleLicenseTypeChange,
    handlePublicationYearChange,
    handleContentUpdate,
    handleSaveDraft,
    handleRequestSubmit,
    handleConfirmSubmit,
    handleCancelSubmit,
    handleDescriptionChange,
    handleGenreChange,
    handleCoverSelect,
    handleCoverRemove,
    handlePageTitleChange,
  };
};
