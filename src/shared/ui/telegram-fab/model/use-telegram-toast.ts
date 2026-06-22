"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TOAST_HEADINGS } from "../lib/headings";
import { useTelegramToastStore } from "./telegram-toast-store";

const STORAGE_KEY = "tg_toast_v2";
const TIMER_DELAY_MS = 3 * 60 * 1000;
const AUTO_CLOSE_MS = 12_000;

// Storage shape: { timerDate: string | null, smartCount: number, smartDate: string | null }
interface ToastStorage {
	timerDate: string | null;
	smartCount: number;
	smartDate: string | null;
}

const todayStr = (): string => new Date().toISOString().slice(0, 10);

const readStorage = (): ToastStorage => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { timerDate: null, smartCount: 0, smartDate: null };
		return JSON.parse(raw) as ToastStorage;
	} catch {
		return { timerDate: null, smartCount: 0, smartDate: null };
	}
};

const writeStorage = (data: ToastStorage): void => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch {
		// ignore
	}
};

const canShowTimer = (): boolean => {
	const stored = readStorage();
	return stored.timerDate !== todayStr();
};

const recordTimer = (): void => {
	const stored = readStorage();
	writeStorage({ ...stored, timerDate: todayStr() });
};

const canShowSmart = (): boolean => {
	const stored = readStorage();
	const today = todayStr();
	if (stored.smartDate !== today) return true;
	return stored.smartCount < 2;
};

const recordSmart = (): void => {
	const stored = readStorage();
	const today = todayStr();
	const isToday = stored.smartDate === today;
	writeStorage({
		...stored,
		smartDate: today,
		smartCount: isToday ? stored.smartCount + 1 : 1,
	});
};

export const useTelegramToast = () => {
	const pathname = usePathname();
	const lang = /^\/(en)/.test(pathname) ? "en" : /^\/(che)/.test(pathname) ? "che" : "ru";

	const [visible, setVisible] = useState(false);
	const toastRef = useRef(TOAST_HEADINGS[Math.floor(Math.random() * TOAST_HEADINGS.length)]);
	const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const { pendingSmartTrigger, consumeSmartTrigger } = useTelegramToastStore();

	const show = () => {
		setVisible(true);
		if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
		autoCloseRef.current = setTimeout(() => setVisible(false), AUTO_CLOSE_MS);
	};

	// Timer: once per day, 3 min after app open
	useEffect(() => {
		if (!canShowTimer()) return;
		const id = setTimeout(() => {
			recordTimer();
			show();
		}, TIMER_DELAY_MS);
		return () => clearTimeout(id);
	}, []);

	// Smart moment: fires when review/reader signals completion
	useEffect(() => {
		if (!pendingSmartTrigger) return;
		consumeSmartTrigger();
		if (!canShowSmart()) return;
		const id = setTimeout(() => {
			toastRef.current = TOAST_HEADINGS[Math.floor(Math.random() * TOAST_HEADINGS.length)];
			recordSmart();
			show();
		}, 1200);
		return () => clearTimeout(id);
	}, [pendingSmartTrigger, consumeSmartTrigger]);

	const handleClose = () => {
		if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
		setVisible(false);
	};

	const { heading, subheading } = toastRef.current;

	return { lang, heading, subheading, visible, handleClose, autoCloseMs: AUTO_CLOSE_MS };
};
