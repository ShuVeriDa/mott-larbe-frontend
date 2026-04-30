"use client";

import { useCallback, useEffect, useState } from "react";

export const useMobileMenu = () => {
	const [open, setOpen] = useState(false);

	const openMenu = useCallback(() => setOpen(true), []);
	const closeMenu = useCallback(() => setOpen(false), []);

	useEffect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	return { open, openMenu, closeMenu };
};
