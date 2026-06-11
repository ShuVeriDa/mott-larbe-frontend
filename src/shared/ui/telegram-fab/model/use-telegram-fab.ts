"use client";

import { usePathname } from "next/navigation";
import { MouseEvent, useEffect, useRef, useState } from "react";

export const useTelegramFab = () => {
	const pathname = usePathname();

	const strippedPath = pathname.replace(/^\/(ru|en|che)/, "");
	const isReader =
		/^\/reader\/[^/]+\/p\/[^/]+/.test(strippedPath) ||
		/^\/my-texts\/[^/]+\/p\/[^/]+/.test(strippedPath);

	const lang = /^\/(en)/.test(pathname) ? "en" : /^\/(che)/.test(pathname) ? "che" : "ru";

	const [expanded, setExpanded] = useState(false);
	const [idle, setIdle] = useState(false);
	const isTouchDevice = useRef(false);
	const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const scheduleIdle = () => {
		if (idleTimer.current) clearTimeout(idleTimer.current);
		idleTimer.current = setTimeout(() => setIdle(true), 4000);
	};

	useEffect(() => {
		isTouchDevice.current = window.matchMedia("(hover: none)").matches;
		scheduleIdle();
		return () => {
			if (idleTimer.current) clearTimeout(idleTimer.current);
		};
	}, []);

	const handleMouseEnter = () => {
		if (isTouchDevice.current) return;
		setExpanded(true);
		setIdle(false);
		if (idleTimer.current) clearTimeout(idleTimer.current);
	};

	const handleMouseLeave = () => {
		if (isTouchDevice.current) return;
		setExpanded(false);
		scheduleIdle();
	};

	const handleIconClick = (e: MouseEvent<HTMLButtonElement>) => {
		if (!isTouchDevice.current) return;
		e.preventDefault();
		setExpanded(prev => !prev);
		setIdle(false);
		if (idleTimer.current) clearTimeout(idleTimer.current);
	};

	const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setExpanded(false);
		scheduleIdle();
	};

	return {
		isReader,
		lang,
		expanded,
		idle,
		handleMouseEnter,
		handleMouseLeave,
		handleIconClick,
		handleClose,
	};
};
