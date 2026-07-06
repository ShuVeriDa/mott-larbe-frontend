"use client";

import { settingsApi } from "@/entities/settings";
import { useReaderFontFamily } from "@/features/reader-font-family";
import { FONT_SIZE_STEPS, useReaderFontSize } from "@/features/reader-font-size";
import { useHighlightVisibility } from "@/features/reader-highlight";
import { useReaderTextLayout } from "@/features/reader-text-width";
import { useReaderTheme } from "@/features/reader-theme";
import {
	ARABIC_FONT_SIZE_STEPS,
	useReaderArabicSettings,
} from "@/features/reader-arabic-settings";
import type { ReaderFontFamily } from "@/features/reader-font-family";
import type { ReaderWordSpacing } from "@/features/reader-text-width";
import { useEffect, useRef } from "react";
import { useReaderInitStore } from "./reader-init-store";

/**
 * Loads reader preferences from the API on mount and hydrates all Zustand stores.
 * API is always the source of truth — overwrites localStorage values.
 * Sets isInitializing=true during fetch so useReaderSettingsSync skips spurious PATCHes.
 */
export const useReaderSettingsInit = () => {
	const initialized = useRef(false);
	const setInitializing = useReaderInitStore((s) => s.setInitializing);

	const setFamily = useReaderFontFamily((s) => s.setFamily);
	const setArabicFamily = useReaderFontFamily((s) => s.setArabicFamily);
	const setSize = useReaderFontSize((s) => s.setSize);
	const { setColumnWidth, setPagePadding, setLineHeight, setLetterSpacing, setParagraphSpacing, setWordSpacing } = useReaderTextLayout();
	const setTheme = useReaderTheme((s) => s.setTheme);
	const setBgColor = useReaderTheme((s) => s.setBgColor);
	const setHighlightsVisible = useHighlightVisibility((s) => s.setHighlightsVisible);
	const { setArabicFontSize } = useReaderArabicSettings();

	useEffect(() => {
		if (initialized.current) return;
		initialized.current = true;

		setInitializing(true);

		settingsApi.getAll().then(({ preferences: p }) => {
			setFamily(p.readerFontFamily);
			const validSize = FONT_SIZE_STEPS.includes(p.readerFontSize as typeof FONT_SIZE_STEPS[number])
				? p.readerFontSize as typeof FONT_SIZE_STEPS[number]
				: 17;
			setSize(validSize);
			setColumnWidth(p.readerColumnWidth);
			setPagePadding(p.readerPagePadding);
			setLineHeight(p.readerLineHeight);
			setLetterSpacing(p.readerLetterSpacing);
			setParagraphSpacing(p.readerParagraphSpacing);
			setTheme(p.readerTheme);
			if (p.readerBgColor) setBgColor(p.readerBgColor);
			setHighlightsVisible(p.highlightKnown);
			if (p.readerWordSpacing) setWordSpacing(p.readerWordSpacing as ReaderWordSpacing);
			if (p.readerArabicFontFamily) setArabicFamily(p.readerArabicFontFamily as ReaderFontFamily);
			if (p.readerArabicFontSize && ARABIC_FONT_SIZE_STEPS.includes(p.readerArabicFontSize as typeof ARABIC_FONT_SIZE_STEPS[number])) {
				setArabicFontSize(p.readerArabicFontSize as typeof ARABIC_FONT_SIZE_STEPS[number]);
			}
		}).catch(() => {
			// API unavailable — keep localStorage values as fallback
		}).finally(() => {
			setInitializing(false);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
};
