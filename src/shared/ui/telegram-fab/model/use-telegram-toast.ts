"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TOAST_HEADINGS } from "../lib/headings";

const STORAGE_KEY = "tg_toast_slots";
const SHOW_DELAY_MS = 3 * 60 * 1000;

// Слоты: [startHour, endHour) — показываем не более одного раза в каждом
const TIME_SLOTS = [
	{ start: 6,  end: 12 },
	{ start: 12, end: 18 },
	{ start: 18, end: 24 },
] as const;

const getCurrentSlot = (): number | null => {
	const hour = new Date().getHours();
	const idx = TIME_SLOTS.findIndex(s => hour >= s.start && hour < s.end);
	return idx === -1 ? null : idx;
};

const todayStart = (): number => new Date().setHours(0, 0, 0, 0);

// ключ слота = индекс + смещение от начала дня, уникален на каждый день
const slotKey = (slot: number): number => todayStart() + slot;

const canShow = (): boolean => {
	try {
		const slot = getCurrentSlot();
		if (slot === null) return false;
		const shown: number[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
		return !shown.includes(slotKey(slot));
	} catch {
		return true;
	}
};

const recordShow = (): void => {
	try {
		const slot = getCurrentSlot();
		if (slot === null) return;
		const start = todayStart();
		const shown: number[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
		const fresh = shown.filter(k => k >= start);
		localStorage.setItem(STORAGE_KEY, JSON.stringify([...fresh, slotKey(slot)]));
	} catch {
		// ignore
	}
};

export const useTelegramToast = () => {
	const pathname = usePathname();
	const lang = /^\/(en)/.test(pathname) ? "en" : /^\/(che)/.test(pathname) ? "che" : "ru";

	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (!canShow()) return;
		const showTimer = setTimeout(() => {
			setVisible(true);
			recordShow();
		}, SHOW_DELAY_MS);
		return () => clearTimeout(showTimer);
	}, []);

	const handleClose = () => setVisible(false);

	const toastRef = useRef(TOAST_HEADINGS[Math.floor(Math.random() * TOAST_HEADINGS.length)]);
	const { heading, subheading } = toastRef.current;

	return { lang, heading, subheading, visible, handleClose };
};
