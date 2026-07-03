import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/locales";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";
import { AdminSpellingFindReplacePage } from "@/widgets/admin-spelling-find-replace";
import type { SpellingMatchType } from "@/entities/spelling-dictionary";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";
const PATH = "/admin/spelling-dictionary/search";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!guardLocaleMetadata(lang)) return {};

	const title = "Find & Replace — Admin | Mott Larbe";
	const description = "Search and fix an arbitrary word or phrase across the published library";

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${PATH}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${PATH}`;

	return {
		title,
		description,
		alternates: {
			canonical: `${SITE_URL}/${lang}${PATH}`,
			languages,
		},
		openGraph: {
			type: "website",
			url: `${SITE_URL}/${lang}${PATH}`,
			title,
			description,
			locale: lang,
			siteName: "Mott Larbe",
		},
		robots: { index: false, follow: false },
	};
};

const VALID_MATCH_TYPES: SpellingMatchType[] = ["substring", "whole_word", "prefix", "suffix"];

interface PageProps {
	params: Promise<{ lang: string }>;
	searchParams: Promise<{
		wrongForm?: string;
		matchType?: string;
		correctForm?: string;
		page?: string;
		textIds?: string | string[];
	}>;
}

const parseInitialTextIds = (textIds: string | string[] | undefined): string[] => {
	if (!textIds) return [];
	const raw = Array.isArray(textIds) ? textIds : textIds.split(",");
	return raw.map((id) => id.trim()).filter(Boolean);
};

const AdminSpellingFindReplaceRoutePage = async ({ params, searchParams }: PageProps) => {
	const { lang } = await params;
	requireLocale(lang);

	const resolvedSearchParams = await searchParams;
	const initialWrongForm = resolvedSearchParams.wrongForm ?? "";
	const initialMatchType: SpellingMatchType = VALID_MATCH_TYPES.includes(
		resolvedSearchParams.matchType as SpellingMatchType,
	)
		? (resolvedSearchParams.matchType as SpellingMatchType)
		: "substring";
	const initialCorrectForm = resolvedSearchParams.correctForm ?? "";
	const initialPage = Math.max(1, Number.parseInt(resolvedSearchParams.page ?? "1", 10) || 1);
	const initialTextIds = parseInitialTextIds(resolvedSearchParams.textIds);

	return (
		<AdminSpellingFindReplacePage
			initialWrongForm={initialWrongForm}
			initialMatchType={initialMatchType}
			initialCorrectForm={initialCorrectForm}
			initialPage={initialPage}
			initialTextIds={initialTextIds}
		/>
	);
};

export default AdminSpellingFindReplaceRoutePage;
