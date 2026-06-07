"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export const useGlobalKeyboard = () => {
	const { lang } = useI18n();
	const router = useRouter();
	// Tracks the first key of a chord sequence (G → L, G → V)
	const pendingChord = useRef<string | null>(null);
	const chordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const clearChord = () => {
			if (chordTimer.current) clearTimeout(chordTimer.current);
			pendingChord.current = null;
		};

		const handleKey = (e: KeyboardEvent) => {
			const tag = document.activeElement?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;

			// ⌘K / Ctrl+K → library search
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				clearChord();
				router.push(`/${lang}/texts`);
				return;
			}

			// Chord sequences: G → L (library), G → V (vocabulary)
			if (pendingChord.current === "g") {
				clearChord();
				if (e.key === "l" || e.key === "L") {
					e.preventDefault();
					router.push(`/${lang}/texts`);
					return;
				}
				if (e.key === "v" || e.key === "V") {
					e.preventDefault();
					router.push(`/${lang}/vocabulary`);
					return;
				}
				return;
			}

			if (e.key === "g" || e.key === "G") {
				if (e.metaKey || e.ctrlKey || e.altKey) return;
				pendingChord.current = "g";
				chordTimer.current = setTimeout(clearChord, 1000);
			}
		};

		window.addEventListener("keydown", handleKey);
		return () => {
			window.removeEventListener("keydown", handleKey);
			clearChord();
		};
	}, [lang, router]);
};
