import { DEFAULT_LOCALE, LOCALES, getDictionary, hasLocale } from "@/i18n/locales";
import { TextsCatalogPage } from "@/widgets/texts-catalog-page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const path = "/texts";
	const title = dict.library.meta.title;
	const description = dict.library.meta.description;

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${path}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

	return {
		title,
		description,
		alternates: { canonical: `${SITE_URL}/${lang}${path}`, languages },
		openGraph: { type: "website", url: `${SITE_URL}/${lang}${path}`, title, description, locale: lang, siteName: "Mott Larbe" },
		robots: { index: false, follow: false },
	};
};

interface PageProps {
	params: Promise<{ lang: string }>;
}

const TextsCatalogRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	return <TextsCatalogPage />;
};

export default TextsCatalogRoutePage;
