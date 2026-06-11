"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "tg_toast_shown";
const SHOW_DELAY_MS = 15000;
const HIDE_ANIMATION_MS = 400;

export const useTelegramToast = () => {
	const pathname = usePathname();
	const lang = /^\/(en)/.test(pathname) ? "en" : /^\/(che)/.test(pathname) ? "che" : "ru";

	const [visible, setVisible] = useState(false);
	const [mounted, setMounted] = useState(false);
	const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (sessionStorage.getItem(SESSION_KEY)) return;
		const showTimer = setTimeout(() => {
			setVisible(true);
			setMounted(true);
			sessionStorage.setItem(SESSION_KEY, "1");
		}, SHOW_DELAY_MS);
		return () => clearTimeout(showTimer);
	}, []);

	useEffect(() => {
		return () => {
			if (hideTimer.current) clearTimeout(hideTimer.current);
		};
	}, []);

	const handleClose = () => {
		setVisible(false);
		hideTimer.current = setTimeout(() => setMounted(false), HIDE_ANIMATION_MS);
	};

	const handleLinkClick = () => {
		handleClose();
	};

	return { lang, visible, mounted, handleClose, handleLinkClick };
};
