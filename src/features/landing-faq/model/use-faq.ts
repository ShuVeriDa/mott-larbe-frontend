"use client";

import { useCallback, useState } from "react";

export const useFaq = (initialOpen = 0) => {
	const [openIndex, setOpenIndex] = useState<number | null>(initialOpen);

	const toggle = useCallback((index: number) => {
		setOpenIndex((current) => (current === index ? null : index));
	}, []);

	return { openIndex, toggle };
};
