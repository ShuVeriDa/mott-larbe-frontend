"use client";

import { http } from "@/shared/api";
import { useReaderFontFamily } from "@/features/reader-font-family";
import { useReaderFontSize } from "@/features/reader-font-size";
import { useReaderTextLayout } from "@/features/reader-text-width";
import { useReaderTheme } from "@/features/reader-theme";
import { useReaderArabicSettings } from "@/features/reader-arabic-settings";
import { useEffect, useRef } from "react";
import { useReaderInitStore } from "./reader-init-store";

const DEBOUNCE_MS = 800;

const patchPreferences = (body: Record<string, unknown>) =>
	http.patch("/settings/preferences", body).catch(() => {});

export const useReaderSettingsSync = () => {
	const isInitializingRef = useRef(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const pendingRef = useRef<Record<string, unknown>>({});
	const mountedRef = useRef(false);

	// Keep isInitializing in a ref so schedule() always reads the latest value
	const isInitializing = useReaderInitStore((s) => s.isInitializing);
	useEffect(() => { isInitializingRef.current = isInitializing; }, [isInitializing]);

	const scheduleRef = useRef((patch: Record<string, unknown>) => {
		if (isInitializingRef.current) return;
		pendingRef.current = { ...pendingRef.current, ...patch };
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			patchPreferences(pendingRef.current);
			pendingRef.current = {};
		}, DEBOUNCE_MS);
	});

	const fontFamily = useReaderFontFamily((s) => s.family);
	const arabicFontFamily = useReaderFontFamily((s) => s.arabicFamily);
	const fontSize = useReaderFontSize((s) => s.size);
	const { columnWidth, pagePadding, lineHeight, letterSpacing, paragraphSpacing, wordSpacing } = useReaderTextLayout();
	const theme = useReaderTheme((s) => s.theme);
	const bgColor = useReaderTheme((s) => s.bgColor);
	const { arabicFontSize } = useReaderArabicSettings();

	useEffect(() => {
		if (!mountedRef.current) { mountedRef.current = true; return; }
		scheduleRef.current({ readerFontFamily: fontFamily });
	}, [fontFamily]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mountedRef.current) return;
		scheduleRef.current({ readerFontSize: fontSize });
	}, [fontSize]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mountedRef.current) return;
		scheduleRef.current({ readerColumnWidth: columnWidth });
	}, [columnWidth]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mountedRef.current) return;
		scheduleRef.current({ readerPagePadding: pagePadding });
	}, [pagePadding]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mountedRef.current) return;
		scheduleRef.current({ readerLineHeight: lineHeight });
	}, [lineHeight]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mountedRef.current) return;
		scheduleRef.current({ readerLetterSpacing: letterSpacing });
	}, [letterSpacing]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mountedRef.current) return;
		scheduleRef.current({ readerParagraphSpacing: paragraphSpacing });
	}, [paragraphSpacing]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mountedRef.current) return;
		scheduleRef.current({ readerWordSpacing: wordSpacing });
	}, [wordSpacing]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mountedRef.current) return;
		scheduleRef.current({ readerTheme: theme });
	}, [theme]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mountedRef.current) return;
		scheduleRef.current({ readerBgColor: bgColor });
	}, [bgColor]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!mountedRef.current) return;
		scheduleRef.current({ readerArabicFontFamily: arabicFontFamily });
	}, [arabicFontFamily]); // eslint-disable-line react-hooks/exhaustive-deps


	useEffect(() => {
		if (!mountedRef.current) return;
		scheduleRef.current({ readerArabicFontSize: arabicFontSize });
	}, [arabicFontSize]); // eslint-disable-line react-hooks/exhaustive-deps

	// Flush pending changes on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
			if (Object.keys(pendingRef.current).length) {
				patchPreferences(pendingRef.current);
			}
		};
	}, []);
};
