"use client";

import { useI18n } from "@/shared/lib/i18n";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getArabicToc, getLatinToc } from "../lib/toc-config";

export const useScriptGuidePage = () => {
	const { t, lang } = useI18n();
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const tab = searchParams.get("tab") === "latin" ? "latin" : "arabic";

	const handleTabChange = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("tab", value);
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const arabicToc = getArabicToc(t);
	const latinToc = getLatinToc(t);

	return { t, lang, tab, handleTabChange, arabicToc, latinToc };
};
