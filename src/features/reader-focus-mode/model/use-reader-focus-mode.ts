"use client";

import { useEffect, useState } from "react";

export const useReaderFocusMode = () => {
	const [active, setActive] = useState(false);

	const toggle = () => setActive(v => !v);

	useEffect(() => {
		if (!active) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setActive(false);
		};
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [active]);

	return { active, toggle };
};
