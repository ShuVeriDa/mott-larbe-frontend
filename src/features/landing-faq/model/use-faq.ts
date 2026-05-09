"use client";
import { useState } from 'react';
export const useFaq = (initialOpen = 0) => {
	const [openIndex, setOpenIndex] = useState<number | null>(initialOpen);

	const toggle = (index: number) => {
		setOpenIndex((current) => (current === index ? null : index));
	};

	return { openIndex, toggle };
};
