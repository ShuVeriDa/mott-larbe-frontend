"use client";

import { aiTranslationApi, useGeminiKeyStatus, type GeminiModel } from "@/entities/ai-translation";
import { useGeminiModelStore, useTranslationLanguageStore } from "@/features/ai-word-lookup";
import type { TranslationLanguage } from "@/entities/ai-translation";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useQueryClient } from "@tanstack/react-query";
import { aiTranslationKeys } from "@/entities/ai-translation";
import { type ChangeEvent, useState } from "react";

const MODEL_LABEL_KEY: Record<GeminiModel, string> = {
  "gemini-3.1-flash-lite": "aiTranslation.models.modelFlashLite",
  "gemini-3.5-flash": "aiTranslation.models.modelFlash",
  "gemini-3.1-pro": "aiTranslation.models.modelPro",
};

export const useAiSection = () => {
  const { t } = useI18n();
  const { success, error } = useToast();
  const { toastApiError } = useApiErrorToast();
  const queryClient = useQueryClient();
  const { data: keyStatus } = useGeminiKeyStatus();
  const { geminiModel, setGeminiModel } = useGeminiModelStore();
  const { targetLanguage, setTargetLanguage } = useTranslationLanguageStore();

  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const hasKey = keyStatus?.hasKey ?? false;

  const handleKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyInput(e.currentTarget.value);
  };

  const handleToggleShow = () => {
    setShowKey(prev => !prev);
  };

  const handleSave = async () => {
    if (!keyInput.trim()) return;
    setIsSaving(true);
    try {
      await aiTranslationApi.saveKey(keyInput.trim());
      setKeyInput("");
      queryClient.invalidateQueries({ queryKey: aiTranslationKeys.keyStatus() });
      success(t("aiTranslation.settings.savedSuccess"));
    } catch (err) {
      toastApiError(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await aiTranslationApi.deleteKey();
      queryClient.invalidateQueries({ queryKey: aiTranslationKeys.keyStatus() });
      success(t("aiTranslation.settings.deletedSuccess"));
    } catch (err) {
      toastApiError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const result = await aiTranslationApi.verifyKey();
      if (result.valid) {
        success(t("aiTranslation.settings.verifySuccess"));
      } else {
        error(t("aiTranslation.settings.verifyError"));
      }
    } catch {
      error(t("aiTranslation.settings.verifyError"));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLanguageChange = (lang: TranslationLanguage) => {
    setTargetLanguage(lang);
  };

  const handleModelChange = async (model: GeminiModel) => {
    if (model === geminiModel) return;
    try {
      await aiTranslationApi.saveModel(model);
      setGeminiModel(model);
      success(t("aiTranslation.settings.modelSaved", { model: t(MODEL_LABEL_KEY[model]) }));
    } catch (err) {
      toastApiError(err);
    }
  };

  return {
    hasKey,
    keyInput,
    showKey,
    isSaving,
    isDeleting,
    isVerifying,
    targetLanguage,
    handleKeyChange,
    handleToggleShow,
    handleSave,
    handleDelete,
    handleVerify,
    handleLanguageChange,
    handleModelChange,
  };
};
