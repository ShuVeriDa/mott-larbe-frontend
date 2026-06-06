"use client";

import { FONT_SIZE_STEPS, useReaderFontSize, type ReaderFontSize } from "@/features/reader-font-size";

export const useFontSize = () => {
	const size = useReaderFontSize(s => s.size);
	const setSize = useReaderFontSize(s => s.setSize);

	const stepIndex = FONT_SIZE_STEPS.indexOf(size as ReaderFontSize);
	const fillPercent = (stepIndex / (FONT_SIZE_STEPS.length - 1)) * 100;

	const change = (delta: number) => {
		const next = stepIndex + delta;
		if (next >= 0 && next < FONT_SIZE_STEPS.length) setSize(FONT_SIZE_STEPS[next]);
	};

	const reset = () => setSize(17);

	return { value: size, fillPercent, change, reset };
};
