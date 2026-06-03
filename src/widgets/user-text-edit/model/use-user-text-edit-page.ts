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
import { useSuspenseQuery } from "@tanstack/react-query";
import type { TipTapDoc } from "@/shared/ui/notion-editor";

const EMPTY_DOC: TipTapDoc = { type: "doc", content: [{ type: "paragraph" }] };

export interface PageContent {
  doc: TipTapDoc;
}

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

  const handleSave = () => {
    if (!title.trim()) { toastError(t("myTexts.validation.titleRequired")); return; }

    const mergedContent = pages.flatMap(p => p.doc.content ?? []);
    const mergedDoc: TipTapDoc = { type: "doc", content: mergedContent };

    createMutation.mutate(
      { title: title.trim(), language, type,
        author: type === "ORIGINAL" ? undefined : author || undefined,
        sourceUrl: sourceUrl || undefined, content: mergedDoc },
      {
        onSuccess: (data) => {
          setIsUnsaved(false);
          success(t("myTexts.createSuccess"));
          router.push(`/${lang}/my-texts/${data.id}/edit`);
        },
        onError: () => toastError(t("myTexts.createError")),
      }
    );
  };

  return {
    t, title, language, type, author, sourceUrl,
    description, coverPreviewUrl, genreId,
    pages, pageTitles, activePage, isUnsaved,
    isSaving: createMutation.isPending,
    handleTitleChange, handleLanguageChange, handleTypeChange,
    handleAuthorChange, handleSourceChange,
    handleDescriptionChange, handleGenreChange, handleCoverSelect, handleCoverRemove,
    handlePageContentChange, handlePageTitleChange,
    handleAddPage, handleSelectPage, handleDeletePage,
    handleSaveDraft: handleSave,
    handlePrimaryAction: handleSave,
  };
};

// ─── Edit mode hook ───────────────────────────────────────────────────────────

export const useUserTextEditPage = (id: string, lang: string) => {
  const { t } = useI18n();
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const updateMutation = useUpdateUserText();

  const { data: userText } = useSuspenseQuery(userTextDetailQueryOptions(id));

  const [title, setTitle] = useState(userText.title);
  const [language, setLanguage] = useState<UserTextLanguage>(userText.language);
  const [type, setType] = useState<UserTextType>(userText.type);
  const [author, setAuthor] = useState(userText.author ?? "");
  const [sourceUrl, setSourceUrl] = useState(userText.sourceUrl ?? "");
  const [description, setDescription] = useState("");
  const [genreId, setGenreId] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [pages, setPages] = useState<PageContent[]>([{ doc: userText.content }]);
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

  const buildSavePayload = () => {
    const mergedContent = pages.flatMap(p => p.doc.content ?? []);
    const mergedDoc: TipTapDoc = { type: "doc", content: mergedContent };
    return {
      title: title.trim(),
      language,
      type,
      author: type === "ORIGINAL" ? undefined : author || undefined,
      sourceUrl: sourceUrl || undefined,
      content: mergedDoc,
    };
  };

  const handleSaveDraft = () => {
    if (!title.trim()) { toastError(t("myTexts.validation.titleRequired")); return; }
    updateMutation.mutate(
      { id, dto: buildSavePayload() },
      {
        onSuccess: () => { setIsUnsaved(false); success(t("myTexts.editSuccess")); },
        onError: () => toastError(t("myTexts.editError")),
      }
    );
  };

  return {
    t, userText, title, language, type, author, sourceUrl,
    description, coverPreviewUrl, genreId,
    pages, pageTitles, activePage, isUnsaved,
    handleDescriptionChange, handleGenreChange, handleCoverSelect, handleCoverRemove,
    handlePageTitleChange,
    isSaving: updateMutation.isPending,
    handleTitleChange, handleLanguageChange, handleTypeChange,
    handleAuthorChange, handleSourceChange,
    handlePageContentChange, handleAddPage, handleSelectPage, handleDeletePage,
    handleSaveDraft,
    handlePrimaryAction: handleSaveDraft,
  };
};
