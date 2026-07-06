"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useDebounce } from "@/shared/lib/debounce";
import {
  useCreateUserText,
  useUpdateUserText,
  userTextDetailQueryOptions,
  type UserText,
  type UserTextLanguage,
  type UserTextType,
} from "@/entities/user-text";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { userScriptVersionsQueryOptions } from "@/entities/text-script-version";
import type { TipTapDoc } from "@/shared/ui/notion-editor";

const EMPTY_DOC: TipTapDoc = { type: "doc", content: [{ type: "paragraph" }] };

export interface PageContent {
  doc: TipTapDoc;
}

// Multi-page storage format inside UserText.content
// { type: "multi-page", pages: TipTapDoc[] }
interface MultiPageContent { type: "multi-page"; pages: TipTapDoc[] }

const packPages = (pages: PageContent[]): TipTapDoc => {
  const packed: MultiPageContent = { type: "multi-page", pages: pages.map(p => p.doc) };
  // Stored as a TipTapDoc-compatible structure via the `attrs` field
  return { type: "doc", content: [{ type: "multi_page_wrapper", attrs: packed }] } as unknown as TipTapDoc;
};

const unpackPages = (content: unknown): PageContent[] => {
  if (!content || typeof content !== "object") return [{ doc: EMPTY_DOC }];
  const c = content as Record<string, unknown>;

  // Detect multi-page format
  if (Array.isArray(c.content) && c.content.length === 1) {
    const first = c.content[0] as Record<string, unknown>;
    if (first?.type === "multi_page_wrapper" && first?.attrs) {
      const packed = first.attrs as MultiPageContent;
      if (packed.type === "multi-page" && Array.isArray(packed.pages)) {
        return packed.pages.map(doc => ({ doc: doc as TipTapDoc }));
      }
    }
  }

  // Legacy single-page content — return as-is
  return [{ doc: content as TipTapDoc }];
};

// ─── Create mode hook ─────────────────────────────────────────────────────────

export const useUserTextCreatePage = (lang: string) => {
  const { t } = useI18n();
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const createMutation = useCreateUserText();

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<UserTextLanguage>("CHE");
  const [type, setType] = useState<UserTextType>("EXTERNAL");
  const [author, setAuthor] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [description, setDescription] = useState("");
  const [genreId, setGenreId] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageContent[]>([{ doc: EMPTY_DOC }]);
  const [pageTitles, setPageTitles] = useState<string[]>([""]);
  const [activePage, setActivePage] = useState(0);
  const [isUnsaved, setIsUnsaved] = useState(false);

  const markUnsaved = () => setIsUnsaved(true);

  const handleTitleChange = (value: string) => { setTitle(value); markUnsaved(); };
  const handleLanguageChange = (v: UserTextLanguage) => { setLanguage(v); markUnsaved(); };
  const handleTypeChange = (v: UserTextType) => { setType(v); markUnsaved(); };
  const handleAuthorChange = (v: string) => { setAuthor(v); markUnsaved(); };
  const handleSourceChange = (v: string) => { setSourceUrl(v); markUnsaved(); };
  const handleDescriptionChange = (v: string) => { setDescription(v); markUnsaved(); };
  const handleGenreChange = (v: string | null) => { setGenreId(v); markUnsaved(); };
  const handleCoverSelect = (file: File) => {
    setCoverFile(file);
    setCoverPreviewUrl(URL.createObjectURL(file));
    markUnsaved();
  };
  const handleCoverRemove = () => { setCoverFile(null); setCoverPreviewUrl(null); markUnsaved(); };
  const handlePageTitleChange = (value: string) => {
    setPageTitles(prev => prev.map((t, i) => i === activePage ? value : t));
    markUnsaved();
  };

  const handlePageContentChange = (doc: TipTapDoc) => {
    setPages(prev => prev.map((p, i) => i === activePage ? { ...p, doc } : p));
    markUnsaved();
  };

  const handleAddPage = () => {
    setPages(prev => [...prev, { doc: EMPTY_DOC }]);
    setPageTitles(prev => [...prev, ""]);
    setActivePage(pages.length);
    markUnsaved();
  };

  const handleSelectPage = (index: number) => setActivePage(index);

  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) return;
    setPages(prev => prev.filter((_, i) => i !== index));
    setPageTitles(prev => prev.filter((_, i) => i !== index));
    setActivePage(prev => Math.min(prev, pages.length - 2));
    markUnsaved();
  };

  const handleSave = (onSuccess?: (id: string) => void) => {
    if (!title.trim()) { toastError(t("myTexts.validation.titleRequired")); return; }

    createMutation.mutate(
      { title: title.trim(), language, type,
        author: type === "ORIGINAL" ? undefined : author || undefined,
        sourceUrl: sourceUrl || undefined, content: packPages(pages) },
      {
        onSuccess: (data) => {
          setIsUnsaved(false);
          if (onSuccess) {
            onSuccess(data.id);
          } else {
            success(t("myTexts.createSuccess"));
            router.push(`/${lang}/my-texts/${data.id}/edit`);
          }
        },
        onError: () => toastError(t("myTexts.createError")),
      }
    );
  };

  const handleSubmitForReview = () => {
    handleSave((id) => {
      router.push(`/${lang}/my-texts/submit/new?from=${id}`);
    });
  };

  return {
    t, title, language, type, author, sourceUrl,
    description, coverPreviewUrl, genreId,
    pages, pageTitles, activePage, isUnsaved,
    isSaving: createMutation.isPending,
    isBackgroundRunning: false,
    handleTitleChange, handleLanguageChange, handleTypeChange,
    handleAuthorChange, handleSourceChange,
    handleDescriptionChange, handleGenreChange, handleCoverSelect, handleCoverRemove,
    handlePageContentChange, handlePageTitleChange,
    handleAddPage, handleSelectPage, handleDeletePage,
    handleSaveDraft: () => handleSave(),
    handlePrimaryAction: () => handleSave(),
    handleSubmitForReview,
  };
};

// ─── Edit mode hook ───────────────────────────────────────────────────────────

export const useUserTextEditPage = (id: string, lang: string) => {
  const { t } = useI18n();
  const router = useRouter();
  const { toast, success, error: toastError } = useToast();
  const updateMutation = useUpdateUserText();

  const { data: userText } = useSuspenseQuery(userTextDetailQueryOptions(id));
  const { data: scriptVersions = [] } = useQuery(userScriptVersionsQueryOptions(id));
  const isBackgroundRunning = scriptVersions.some((v) => v.status === "RUNNING");

  const [title, setTitle] = useState(userText.title);
  const [language, setLanguage] = useState<UserTextLanguage>(userText.language);
  const [type, setType] = useState<UserTextType>(userText.type);
  const [author, setAuthor] = useState(userText.author ?? "");
  const [sourceUrl, setSourceUrl] = useState(userText.sourceUrl ?? "");
  const [description, setDescription] = useState("");
  const [genreId, setGenreId] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [pages, setPages] = useState<PageContent[]>(() => unpackPages(userText.content));
  const [pageTitles, setPageTitles] = useState<string[]>(() =>
    Array.from({ length: unpackPages(userText.content).length }, () => "")
  );
  const [activePage, setActivePage] = useState(0);
  const [isUnsaved, setIsUnsaved] = useState(false);

  const markUnsaved = () => setIsUnsaved(true);

  const handleTitleChange = (value: string) => { setTitle(value); markUnsaved(); };
  const handleLanguageChange = (v: UserTextLanguage) => { setLanguage(v); markUnsaved(); };
  const handleTypeChange = (v: UserTextType) => { setType(v); markUnsaved(); };
  const handleAuthorChange = (v: string) => { setAuthor(v); markUnsaved(); };
  const handleSourceChange = (v: string) => { setSourceUrl(v); markUnsaved(); };
  const handleDescriptionChange = (v: string) => { setDescription(v); markUnsaved(); };
  const handleGenreChange = (v: string | null) => { setGenreId(v); markUnsaved(); };
  const handleCoverSelect = (file: File) => {
    setCoverPreviewUrl(URL.createObjectURL(file));
    markUnsaved();
  };
  const handleCoverRemove = () => { setCoverPreviewUrl(null); markUnsaved(); };
  const handlePageTitleChange = (value: string) => {
    setPageTitles(prev => prev.map((t, i) => i === activePage ? value : t));
    markUnsaved();
  };

  const handlePageContentChange = (doc: TipTapDoc) => {
    setPages(prev => prev.map((p, i) => i === activePage ? { ...p, doc } : p));
    markUnsaved();
  };

  const handleAddPage = () => {
    setPages(prev => [...prev, { doc: EMPTY_DOC }]);
    setPageTitles(prev => [...prev, ""]);
    setActivePage(pages.length);
    markUnsaved();
  };

  const handleSelectPage = (index: number) => setActivePage(index);

  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) return;
    setPages(prev => prev.filter((_, i) => i !== index));
    setActivePage(prev => Math.min(prev, pages.length - 2));
    markUnsaved();
  };

  const buildSavePayload = () => ({
    title: title.trim(),
    language,
    type,
    author: type === "ORIGINAL" ? undefined : author || undefined,
    sourceUrl: sourceUrl || undefined,
    content: packPages(pages),
  });

  const handleSaveDraft = (onSuccess?: () => void) => {
    if (!title.trim()) { toastError(t("myTexts.validation.titleRequired")); return; }
    updateMutation.mutate(
      { id, dto: buildSavePayload() },
      {
        onSuccess: () => {
          setIsUnsaved(false);
          if (onSuccess) { onSuccess(); } else {
            success(t("myTexts.editSuccess"));
            if (isBackgroundRunning) toast(t("myTexts.backgroundSaveWarning"));
          }
        },
        onError: () => toastError(t("myTexts.editError")),
      }
    );
  };

  const handleSubmitForReview = () => {
    handleSaveDraft(() => {
      router.push(`/${lang}/my-texts/submit/new?from=${id}`);
    });
  };

  return {
    t, userText, title, language, type, author, sourceUrl,
    description, coverPreviewUrl, genreId,
    pages, pageTitles, activePage, isUnsaved,
    handleDescriptionChange, handleGenreChange, handleCoverSelect, handleCoverRemove,
    handlePageTitleChange,
    isSaving: updateMutation.isPending,
    isBackgroundRunning,
    handleTitleChange, handleLanguageChange, handleTypeChange,
    handleAuthorChange, handleSourceChange,
    handlePageContentChange, handleAddPage, handleSelectPage, handleDeletePage,
    handleSaveDraft: () => handleSaveDraft(),
    handlePrimaryAction: () => handleSaveDraft(),
    handleSubmitForReview,
  };
};
