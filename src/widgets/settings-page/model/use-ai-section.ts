"use client";

import { aiTranslationApi, useGeminiKeyStatus, type GeminiModel } from "@/entities/ai-translation";
import { useGeminiModelStore, useTranslationLanguageStore } from "@/features/ai-word-lookup";
import type { TranslationLanguage } from "@/entities/ai-translation";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  const hasKey = keyStatus?.hasKey ?? false;

  const handleKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyInput(e.currentTarget.value);
  };

  const handleToggleShow = () => {
    setShowKey(prev => !prev);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      await aiTranslationApi.saveKey(keyInput.trim());
    },
    onSuccess: () => {
      setKeyInput("");
      queryClient.invalidateQueries({ queryKey: aiTranslationKeys.keyStatus() });
      success(t("aiTranslation.settings.savedSuccess"));
    },
    onError: (err) => {
      toastApiError(err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await aiTranslationApi.deleteKey();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiTranslationKeys.keyStatus() });
      success(t("aiTranslation.settings.deletedSuccess"));
    },
    onError: (err) => {
      toastApiError(err);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      return await aiTranslationApi.verifyKey();
    },
    onSuccess: (result) => {
      if (result.valid) {
        success(t("aiTranslation.settings.verifySuccess"));
      } else {
        error(t("aiTranslation.settings.verifyError"));
      }
    },
    onError: () => {
      error(t("aiTranslation.settings.verifyError"));
    },
  });

  const handleSave = () => {
    if (!keyInput.trim()) return;
    saveMutation.mutate();
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleVerify = () => {
    verifyMutation.mutate();
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
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isVerifying: verifyMutation.isPending,
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
