"use client";

import { useMutation } from "@tanstack/react-query";
import { settingsApi, type ExportFormat } from "../api";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

const downloadBlob = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
};

const buildJsonBlob = async (raw: Blob): Promise<Blob> => {
	const text = await raw.text();
	try {
		const parsed = JSON.parse(text);
		return new Blob([JSON.stringify(parsed, null, 2)], {
			type: "application/json",
		});
	} catch {
		return raw;
	}
};

export const useExportVocabulary = () => {
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: async (format: ExportFormat) => {
			const blob = await settingsApi.exportVocabulary(format);
			const filename = `vocabulary.${format}`;
			const finalBlob =
				format === "json" ? await buildJsonBlob(blob) : blob;
			downloadBlob(finalBlob, filename);
		},
		onError: toastApiError,
	});
};

export const useExportProgress = () => {
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: async () => {
			const blob = await settingsApi.exportProgress();
			downloadBlob(await buildJsonBlob(blob), "progress.json");
		},
		onError: toastApiError,
	});
};

export const useExportArchive = () => {
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: async () => {
			const blob = await settingsApi.exportArchive();
			downloadBlob(await buildJsonBlob(blob), "account-archive.json");
		},
		onError: toastApiError,
	});
};
