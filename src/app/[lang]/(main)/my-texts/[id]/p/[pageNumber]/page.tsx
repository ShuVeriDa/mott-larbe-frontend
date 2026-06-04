import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, getDictionary, hasLocale } from "@/i18n/locales";
import { SITE_URL } from "@/shared/lib/seo";
import { UserTextReaderPageClient } from "@/widgets/reader-page/ui/user-text-reader-page-client";

const parsePage = (raw: string) => {
	const parsed = Number.parseInt(raw, 10);
	if (!Number.isFinite(parsed) || parsed < 1) return null;
	return parsed;
};

export const generateMetadata = async (props: {
	params: Promise<{ lang: string; id: string; pageNumber: string }>;
}): Promise<Metadata> => {
	const { lang, id, pageNumber: rawPage } = await props.params;
	if (!hasLocale(lang)) return {};

	const page = parsePage(rawPage);
	if (!page) return {};

	const dict = await getDictionary(lang);
	const meta = dict.myTexts.meta;
	const path = `/my-texts/${id}/p/${page}`;

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${path}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

	return {
		title: meta.readerTitle,
		description: meta.description,
		alternates: { canonical: `${SITE_URL}/${lang}${path}`, languages },
		openGraph: {
			type: "article",
			url: `${SITE_URL}/${lang}${path}`,
			title: meta.readerTitle,
			description: meta.description,
			locale: lang,
			siteName: "Mott Larbe",
		},
		twitter: { card: "summary", title: meta.readerTitle, description: meta.description },
		// Private — must not appear in search results
		robots: { index: false, follow: false },
	};
};

interface PageProps {
	params: Promise<{ lang: string; id: string; pageNumber: string }>;
}

const MyTextReaderRoutePage = async ({ params }: PageProps) => {
	const { lang, id, pageNumber: rawPage } = await params;
	if (!hasLocale(lang)) notFound();

	const page = parsePage(rawPage);
	if (!page) notFound();

	// No server-side prefetch — endpoint requires auth cookie unavailable in RSC.
	// Data fetches client-side via useUserTextReaderContext after mount.
	return <UserTextReaderPageClient userTextId={id} pageNumber={page} />;
};

export default MyTextReaderRoutePage;
