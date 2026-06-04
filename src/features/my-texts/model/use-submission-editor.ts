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

export interface SubmissionPageContent {
  doc: TipTapDoc;
  title: string;
}

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
    pages: SubmissionPageContent[];
  }>;
  lang: string;
  onSaved?: (id: string) => void;
}

const submissionToPages = (submission: TextSubmission): SubmissionPageContent[] => {
  if (submission.pages && submission.pages.length > 0) {
    return [...submission.pages]
      .sort((a, b) => a.pageNumber - b.pageNumber)
      .map((p) => ({ doc: p.contentRich, title: p.title ?? "" }));
  }
  // Legacy fallback: single contentRich field
  if (submission.contentRich) {
    return [{ doc: submission.contentRich, title: "" }];
  }
  return [{ doc: EMPTY_DOC, title: "" }];
};

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
  const [pages, setPages] = useState<SubmissionPageContent[]>(
    () => initial?.pages ?? (existingDraft ? submissionToPages(existingDraft) : [{ doc: EMPTY_DOC, title: "" }]),
  );
  const [activePage, setActivePage] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<SubmissionFormFieldErrors>({});
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  // UI-only fields (not yet persisted to TextSubmission schema)
  const [description, setDescription] = useState("");
  const [genreId, setGenreId] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

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
    setPages(submissionToPages(existingDraft));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingDraft?.id]);

  // Sync state when initial values arrive asynchronously (from=userTextId flow)
  const initialRef = useRef(initial);
  useEffect(() => {
    if (!initial || initial === initialRef.current) return;
    initialRef.current = initial;
    setTitle(initial.title ?? "");
    if (initial.language) setLanguage(initial.language);
    if (initial.submissionType) setSubmissionType(initial.submissionType);
    setAuthor(initial.author ?? "");
    setSourceUrl(initial.sourceUrl ?? "");
    if (initial.pages) setPages(initial.pages);
  }, [initial]);

  // ─── Derived ─────────────────────────────────────────────────────────────

  const isExternal = submissionType === "EXTERNAL";
  const totalContentBytes = pages.reduce(
    (sum, p) => sum + JSON.stringify(p.doc).length,
    0,
  );
  const isContentTooLarge = totalContentBytes > CONTENT_WARN_BYTES;
  const savedIdRef = useRef<string | null>(draftId ?? null);
  const lastSavedPagesRef = useRef<SubmissionPageContent[]>(
    initial?.pages ?? (existingDraft ? submissionToPages(existingDraft) : [{ doc: EMPTY_DOC, title: "" }]),
  );

  // ─── Auto-save (edit mode only) ───────────────────────────────────────────

  const debouncedPages = useDebounce(pages, 30_000);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  useEffect(() => {
    const id = savedIdRef.current;
    if (mode !== "edit" || !id) return;
    const isSame =
      JSON.stringify(debouncedPages) ===
      JSON.stringify(lastSavedPagesRef.current);
    if (isSame) return;

    setAutoSaveStatus("saving");
    updateMutation.mutate(
      {
        id,
        dto: {
          pages: debouncedPages.map((p, i) => ({
            pageNumber: i + 1,
            title: p.title || undefined,
            contentRich: p.doc,
          })),
        },
      },
      {
        onSuccess: () => {
          lastSavedPagesRef.current = debouncedPages;
          setAutoSaveStatus("saved");
        },
        onError: () => setAutoSaveStatus("error"),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPages]);

  // ─── Unsaved changes guard ────────────────────────────────────────────────

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasUnsaved =
        JSON.stringify(pages) !== JSON.stringify(lastSavedPagesRef.current);
      if (hasUnsaved) e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pages]);

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

  // ─── Build pages DTO ─────────────────────────────────────────────────────

  const buildPagesDto = () =>
    pages.map((p, i) => ({
      pageNumber: i + 1,
      title: p.title || undefined,
      contentRich: p.doc,
    }));

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
      pages: buildPagesDto(),
      status: "DRAFT" as const,
    };

    if (mode === "create") {
      createMutation.mutate(dto, {
        onSuccess: (data) => {
          savedIdRef.current = data.id;
          lastSavedPagesRef.current = pages;
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
            lastSavedPagesRef.current = pages;
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
    setShowSubmitConfirm(false);

    const existingId = savedIdRef.current;

    const doSubmit = (id: string) => {
      submitMutation.mutate(id, {
        onSuccess: () => {
          success(t("myTexts.submit.success"));
          router.push(`/${lang}/my-texts`);
        },
        onError: () => toastError(t("myTexts.submit.error")),
      });
    };

    if (existingId) {
      doSubmit(existingId);
      return;
    }

    // create mode: draft not yet saved — create it first, then submit
    const dto = {
      title: title.trim(),
      language,
      submissionType,
      author: submissionType === "ORIGINAL" ? undefined : author || undefined,
      sourceUrl: sourceUrl || undefined,
      licenseType: isExternal && licenseType ? licenseType : undefined,
      publicationYear:
        isExternal && publicationYear ? parseInt(publicationYear, 10) : undefined,
      pages: buildPagesDto(),
      status: "DRAFT" as const,
    };

    createMutation.mutate(dto, {
      onSuccess: (data) => {
        savedIdRef.current = data.id;
        lastSavedPagesRef.current = pages;
        doSubmit(data.id);
      },
      onError: () => toastError(t("myTexts.submit.saveError")),
    });
  };

  const handleCancelSubmit = () => setShowSubmitConfirm(false);

  // ─── Page management ──────────────────────────────────────────────────────

  const handlePageContentChange = (doc: TipTapDoc) => {
    setPages((prev) => prev.map((p, i) => (i === activePage ? { ...p, doc } : p)));
    if (fieldErrors.contentRich)
      setFieldErrors((prev) => ({ ...prev, contentRich: undefined }));
  };

  const handlePageTitleChange = (value: string) => {
    setPages((prev) =>
      prev.map((p, i) => (i === activePage ? { ...p, title: value } : p)),
    );
  };

  const handleAddPage = () => {
    setPages((prev) => [...prev, { doc: EMPTY_DOC, title: "" }]);
    setActivePage(pages.length);
  };

  const handleSelectPage = (index: number) => setActivePage(index);

  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) return;
    setPages((prev) => prev.filter((_, i) => i !== index));
    setActivePage((prev) => Math.min(prev, pages.length - 2));
  };

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

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    submitMutation.isPending;

  const isLoadingDraft = mode === "edit" && draftId ? draftQuery.isPending : false;

  // UI-only handlers
  const handleDescriptionChange = (v: string) => setDescription(v);
  const handleGenreChange = (v: string | null) => setGenreId(v);
  const handleCoverSelect = (file: File) => setCoverPreviewUrl(URL.createObjectURL(file));
  const handleCoverRemove = () => setCoverPreviewUrl(null);

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
    pages,
    activePage,
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
    // Handlers
    handleTitleChange,
    handleLanguageChange,
    handleSubmissionTypeChange,
    handleAuthorChange,
    handleSourceUrlChange,
    handleLicenseTypeChange,
    handlePublicationYearChange,
    handlePageContentChange,
    handlePageTitleChange,
    handleAddPage,
    handleSelectPage,
    handleDeletePage,
    handleSaveDraft,
    handleRequestSubmit,
    handleConfirmSubmit,
    handleCancelSubmit,
    handleDescriptionChange,
    handleGenreChange,
    handleCoverSelect,
    handleCoverRemove,
  };
};
