import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, getDictionary, hasLocale } from "@/i18n/locales";
import { SITE_URL } from "@/shared/lib/seo";
import { MyTextsPage } from "@/widgets/my-texts-page";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = dict.myTexts.meta;
	const path = "/my-texts";

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${path}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

	return {
		title: meta.title,
		description: meta.description,
		alternates: {
			canonical: `${SITE_URL}/${lang}${path}`,
			languages,
		},
		openGraph: {
			type: "website",
			url: `${SITE_URL}/${lang}${path}`,
			title: meta.title,
			description: meta.description,
			locale: lang,
			siteName: "Mott Larbe",
		},
		twitter: { card: "summary", title: meta.title, description: meta.description },
		// Private pages must not appear in search results
		robots: { index: false, follow: false },
	};
};

interface PageProps {
	params: Promise<{ lang: string }>;
}

const MyTextsRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	return <MyTextsPage lang={lang} />;
};

export default MyTextsRoutePage;
