"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { getApiErrorCode, getErrorI18nKey } from "@/shared/api";

export const useApiErrorToast = () => {
  const { t } = useI18n();
  const { error: toastError } = useToast();

  const toastApiError = (error: unknown) => {
    const code = getApiErrorCode(error);
    const i18nKey = getErrorI18nKey(code);
    toastError(t(i18nKey));
  };

  return { toastApiError };
};
