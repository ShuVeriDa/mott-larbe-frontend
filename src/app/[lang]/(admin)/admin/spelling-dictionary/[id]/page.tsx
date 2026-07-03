import type { Metadata } from "next";
import {
	DEFAULT_LOCALE,
	LOCALES,
	getDictionary,
} from "@/i18n/locales";
import { AdminSpellingDictionaryDetailPage } from "@/widgets/admin-spelling-dictionary-detail";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> => {
	const { lang, id } = await props.params;
	if (!guardLocaleMetadata(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = (
		dict as Record<string, unknown> & {
			admin?: {
				meta?: {
					spellingDictionaryDetail?: { title?: string; description?: string };
				};
			};
		}
	)?.admin?.meta?.spellingDictionaryDetail;

	const title = meta?.title ?? "Spelling Entry Occurrences — Admin | Mott Larbe";
	const description =
		meta?.description ?? "View and fix occurrences of a spelling entry across the published library";

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}/admin/spelling-dictionary/${id}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}/admin/spelling-dictionary/${id}`;

	return {
		title,
		description,
		alternates: {
			canonical: `${SITE_URL}/${lang}/admin/spelling-dictionary/${id}`,
			languages,
		},
		openGraph: {
			type: "website",
			url: `${SITE_URL}/${lang}/admin/spelling-dictionary/${id}`,
			title,
			description,
			locale: lang,
			siteName: "Mott Larbe",
		},
		robots: {
			index: false,
			follow: false,
		},
	};
};

interface PageProps {
	params: Promise<{ lang: string; id: string }>;
	searchParams: Promise<{ page?: string; textIds?: string | string[] }>;
}

const parseInitialTextIds = (textIds: string | string[] | undefined): string[] => {
	if (!textIds) return [];
	const raw = Array.isArray(textIds) ? textIds : textIds.split(",");
	return raw.map((id) => id.trim()).filter(Boolean);
};

const AdminSpellingDictionaryDetailRoutePage = async ({ params, searchParams }: PageProps) => {
	const { lang, id } = await params;
	requireLocale(lang);

	const resolvedSearchParams = await searchParams;
	const initialPage = Math.max(1, Number.parseInt(resolvedSearchParams.page ?? "1", 10) || 1);
	const initialTextIds = parseInitialTextIds(resolvedSearchParams.textIds);

	return (
		<AdminSpellingDictionaryDetailPage
			entryId={id}
			initialPage={initialPage}
			initialTextIds={initialTextIds}
		/>
	);
};

export default AdminSpellingDictionaryDetailRoutePage;
