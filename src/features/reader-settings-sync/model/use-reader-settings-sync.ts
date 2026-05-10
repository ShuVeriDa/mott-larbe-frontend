"use client";

import { http } from "@/shared/api";
import { useReaderFontFamily } from "@/features/reader-font-family";
import { useReaderFontSize } from "@/features/reader-font-size";
import { useReaderTextLayout } from "@/features/reader-text-width";
import { useReaderTheme } from "@/features/reader-theme";
import { useEffect, useRef } from "react";

const patchPreferences = (body: Record<string, unknown>) =>
	http.patch("/settings/preferences", body).catch(() => {});

export const useReaderSettingsSync = () => {
	const fontFamily = useReaderFontFamily((s) => s.family);
	const fontSize = useReaderFontSize((s) => s.size);
	const { columnWidth, pagePadding, lineHeight, letterSpacing } = useReaderTextLayout();
	const theme = useReaderTheme((s) => s.theme);
	const bgColor = useReaderTheme((s) => s.bgColor);

	const mounted = useRef(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Keep latest values in a ref so the debounced flush always sends current state
	const pendingRef = useRef<Record<string, unknown>>({});

	const schedule = (patch: Record<string, unknown>) => {
		pendingRef.current = { ...pendingRef.current, ...patch };
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			patchPreferences(pendingRef.current);
			pendingRef.current = {};
		}, 600);
	};

	useEffect(() => {
		if (!mounted.current) { mounted.current = true; return; }
		schedule({ readerFontFamily: fontFamily });
	}, [fontFamily]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mounted.current) return;
		schedule({ readerFontSize: fontSize });
	}, [fontSize]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mounted.current) return;
		schedule({ readerColumnWidth: columnWidth });
	}, [columnWidth]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mounted.current) return;
		schedule({ readerPagePadding: pagePadding });
	}, [pagePadding]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mounted.current) return;
		schedule({ readerLineHeight: lineHeight });
	}, [lineHeight]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mounted.current) return;
		schedule({ readerLetterSpacing: letterSpacing });
	}, [letterSpacing]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mounted.current) return;
		schedule({ readerTheme: theme });
	}, [theme]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mounted.current) return;
		schedule({ readerBgColor: bgColor });
	}, [bgColor]); // eslint-disable-line react-hooks/exhaustive-deps

	// Flush on unmount if there are pending changes
	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
			if (Object.keys(pendingRef.current).length) {
				patchPreferences(pendingRef.current);
			}
		};
	}, []);
};
