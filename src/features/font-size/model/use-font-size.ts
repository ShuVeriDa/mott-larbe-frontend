"use client";

import { useState } from "react";
import { useUpdatePreferences } from "@/entities/settings";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";

export const FONT_SIZE_MIN = 12;
export const FONT_SIZE_MAX = 24;
export const FONT_SIZE_DEFAULT = 16;

export const useFontSize = (initial: number) => {
	const { t } = useI18n();
	const { mutateAsync, isPending } = useUpdatePreferences();
	const { success, error } = useToast();
	const [value, setValue] = useState<number>(initial);

	const change = (delta: number) => {
		setValue((v) =>
			Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, v + delta)),
		);
	};

	const reset = () => {
		setValue(FONT_SIZE_DEFAULT);
	};

	const save = async () => {
		try {
			await mutateAsync({ fontSize: value });
			success(t("settings.toasts.fontSaved"));
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

	const fillPercent =
		((value - FONT_SIZE_MIN) / (FONT_SIZE_MAX - FONT_SIZE_MIN)) * 100;

	return { value, isSaving: isPending, change, reset, save, fillPercent };
};
