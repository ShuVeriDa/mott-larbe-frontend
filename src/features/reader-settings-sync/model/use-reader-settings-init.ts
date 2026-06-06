"use client";

import { settingsApi } from "@/entities/settings";
import { useReaderFontFamily } from "@/features/reader-font-family";
import { FONT_SIZE_STEPS, useReaderFontSize } from "@/features/reader-font-size";
import { useHighlightVisibility } from "@/features/reader-highlight";
import { useReaderTextLayout } from "@/features/reader-text-width";
import { useReaderTheme } from "@/features/reader-theme";
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
	const setSize = useReaderFontSize((s) => s.setSize);
	const { setColumnWidth, setPagePadding, setLineHeight, setLetterSpacing, setParagraphSpacing } = useReaderTextLayout();
	const setTheme = useReaderTheme((s) => s.setTheme);
	const setBgColor = useReaderTheme((s) => s.setBgColor);
	const setHighlightsVisible = useHighlightVisibility((s) => s.setHighlightsVisible);

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
		}).catch(() => {
			// API unavailable — keep localStorage values as fallback
		}).finally(() => {
			setInitializing(false);
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
};
