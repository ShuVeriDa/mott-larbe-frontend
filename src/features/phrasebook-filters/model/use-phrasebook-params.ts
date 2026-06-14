"use client";

import { PhraseLang } from "@/entities/phrasebook";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const VALID_LANGS = Object.values(PhraseLang);

export interface PhrasebookParams {
	categoryId: string | null;
	lang: PhraseLang | null;
	savedOnly: boolean;
}

export interface PhrasebookParamsActions {
	setCategoryId: (id: string | null) => void;
	setLang: (lang: PhraseLang | null) => void;
	setSavedOnly: (saved: boolean) => void;
}

export const usePhrasebookParams = (defaultLang?: PhraseLang | null): PhrasebookParams & PhrasebookParamsActions => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const categoryId = searchParams.get("category");
	const langRaw = searchParams.get("lang");
	const langFromUrl = VALID_LANGS.includes(langRaw as PhraseLang) ? (langRaw as PhraseLang) : null;
	const lang = langRaw !== null ? langFromUrl : (defaultLang ?? null);
	const savedOnly = searchParams.get("saved") === "1";

	const patch = useCallback(
		(updates: Partial<{ category: string | null; lang: string | null; saved: string | null }>) => {
			const params = new URLSearchParams(searchParams.toString());
			for (const [key, value] of Object.entries(updates)) {
				if (value == null) params.delete(key);
				else params.set(key, value);
			}
			const qs = params.toString();
			router.replace(qs ? `?${qs}` : "?", { scroll: false });
		},
		[searchParams, router],
	);

	const setCategoryId = useCallback(
		(id: string | null) => patch({ category: id }),
		[patch],
	);

	const setLang = useCallback(
		(l: PhraseLang | null) => patch({ lang: l }),
		[patch],
	);

	const setSavedOnly = useCallback(
		(saved: boolean) => patch({ saved: saved ? "1" : null, category: null }),
		[patch],
	);

	return { categoryId, lang, savedOnly, setCategoryId, setLang, setSavedOnly };
};
