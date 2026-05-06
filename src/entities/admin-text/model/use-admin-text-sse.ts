"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL, ACCESS_TOKEN_STORAGE_KEY } from "@/shared/config";
import { adminTextKeys } from "../api/admin-text-keys";
import type { SseProgressEvent } from "../api/types";

export const useAdminTextSSE = (textId: string, enabled: boolean) => {
	const [progress, setProgress] = useState<SseProgressEvent | null>(null);
	const qc = useQueryClient();

	useEffect(() => {
		if (!enabled) return;

		const controller = new AbortController();

		const connect = async () => {
			const token =
				typeof window !== "undefined"
					? window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
					: null;

			let response: Response;
			try {
				response = await fetch(
					`${API_URL}/admin/texts/${textId}/process/stream`,
					{
						headers: {
							Accept: "text/event-stream",
							...(token ? { Authorization: `Bearer ${token}` } : {}),
						},
						signal: controller.signal,
					},
				);
			} catch {
				return;
			}

			const reader = response.body?.getReader();
			if (!reader) return;

			const decoder = new TextDecoder();
			let buffer = "";

			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					buffer += decoder.decode(value, { stream: true });
					const chunks = buffer.split("\n\n");
					buffer = chunks.pop() ?? "";

					for (const chunk of chunks) {
						const dataLine = chunk
							.split("\n")
							.find((l) => l.startsWith("data:"));
						if (!dataLine) continue;
						try {
							const event: SseProgressEvent = JSON.parse(
								dataLine.slice(5).trim(),
							);
							setProgress(event);
							if (
								event.status === "COMPLETED" ||
								event.status === "ERROR"
							) {
								qc.invalidateQueries({ queryKey: adminTextKeys.root });
								return;
							}
						} catch {
							// malformed event — skip
						}
					}
				}
			} catch (e) {
				if ((e as Error).name !== "AbortError") {
					qc.invalidateQueries({ queryKey: adminTextKeys.root });
				}
			} finally {
				reader.releaseLock();
			}
		};

		connect();
		return () => controller.abort();
	}, [textId, enabled, qc]);

	return progress;
};
