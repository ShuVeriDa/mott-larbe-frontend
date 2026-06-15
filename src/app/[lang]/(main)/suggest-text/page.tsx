import type { Metadata } from "next";
import {
	DEFAULT_LOCALE,
	LOCALES,
	getDictionary,
} from "@/i18n/locales";
import { OG_LOCALES, SITE_URL } from "@/shared/lib/seo";
import { SuggestTextPage } from "@/widgets/suggest-text-page";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";

export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!guardLocaleMetadata(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = dict.suggestTextPage.meta;
	const path = "/suggest-text";

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
			locale: OG_LOCALES[lang] ?? lang,
			siteName: "Mott Larbe",
		},
		twitter: {
			card: "summary",
			title: meta.title,
			description: meta.description,
		},
		robots: {
			index: true,
			follow: true,
		},
	};
};

interface PageProps {
	params: Promise<{ lang: string }>;
}

const SuggestTextRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	requireLocale(lang);

	const dict = await getDictionary(lang);
	const { title, description } = dict.suggestTextPage.meta;
	const pageUrl = `${SITE_URL}/${lang}/suggest-text`;
	const homeUrl = `${SITE_URL}/${lang}`;

	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebPage",
				"@id": pageUrl,
				url: pageUrl,
				name: title,
				description,
				inLanguage: lang,
				isPartOf: { "@id": `${SITE_URL}/#website` },
			},
			{
				"@type": "BreadcrumbList",
				itemListElement: [
					{ "@type": "ListItem", position: 1, name: "Mott Larbe", item: homeUrl },
					{ "@type": "ListItem", position: 2, name: title, item: pageUrl },
				],
			},
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
			/>
			<SuggestTextPage />
		</>
	);
};

export default SuggestTextRoutePage;
