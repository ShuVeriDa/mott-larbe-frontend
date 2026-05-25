"use client";

import { aiTranslationApi, useGeminiKeyStatus } from "@/entities/ai-translation";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useQueryClient } from "@tanstack/react-query";
import { aiTranslationKeys } from "@/entities/ai-translation";
import { type ChangeEvent, useState } from "react";

export const useAiSection = () => {
  const { t } = useI18n();
  const { success, error } = useToast();
  const { toastApiError } = useApiErrorToast();
  const queryClient = useQueryClient();
  const { data: keyStatus } = useGeminiKeyStatus();

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

  return {
    hasKey,
    keyInput,
    showKey,
    isSaving,
    isDeleting,
    isVerifying,
    handleKeyChange,
    handleToggleShow,
    handleSave,
    handleDelete,
    handleVerify,
  };
};
