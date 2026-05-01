import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	DEFAULT_LOCALE,
	LOCALES,
	getDictionary,
	hasLocale,
} from "@/i18n/locales";
import { ReaderPage } from "@/widgets/reader-page";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

interface PageRouteParams {
	lang: string;
	textId: string;
	pageNumber: string;
}

const parsePage = (raw: string) => {
	const parsed = Number.parseInt(raw, 10);
	if (!Number.isFinite(parsed) || parsed < 1) return null;
	return parsed;
};

export const generateMetadata = async ({
	params,
}: {
	params: Promise<PageRouteParams>;
}): Promise<Metadata> => {
	const { lang, textId, pageNumber } = await params;
	if (!hasLocale(lang)) return {};

	const page = parsePage(pageNumber);
	if (!page) return {};

	const dict = await getDictionary(lang);
	const meta = dict.reader.meta;
	const path = `/reader/${textId}/p/${page}`;

	const title = meta.title.replace("{page}", String(page));
	const description = meta.description.replace("{page}", String(page));

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${path}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

	return {
		title,
		description,
		alternates: {
			canonical: `${SITE_URL}/${lang}${path}`,
			languages,
		},
		openGraph: {
			type: "article",
			url: `${SITE_URL}/${lang}${path}`,
			title,
			description,
			locale: lang,
			siteName: "Mott Larbe",
		},
		twitter: {
			card: "summary",
			title,
			description,
		},
		robots: {
			index: false,
			follow: false,
		},
	};
};

const Page = async ({
	params,
}: {
	params: Promise<PageRouteParams>;
}) => {
	const { lang, textId, pageNumber } = await params;
	if (!hasLocale(lang)) notFound();

	const page = parsePage(pageNumber);
	if (!page) notFound();

	return <ReaderPage textId={textId} pageNumber={page} />;
};

export default Page;
