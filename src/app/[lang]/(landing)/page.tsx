"use cache";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	LOCALES,
	getDictionary,
	hasLocale,
} from "@/i18n/locales";
import { buildAlternates, buildOpenGraph, SITE_URL } from "@/shared/lib/seo";
import { LandingPage } from "@/widgets/landing-page";

export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

interface PageProps {
	params: Promise<{ lang: string }>;
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const { title, description } = dict.landing.meta;
	const { canonical, languages } = buildAlternates(lang, "");

	return {
		title,
		description,
		alternates: { canonical, languages },
		openGraph: buildOpenGraph(lang, "", title, description),
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [`${SITE_URL}/opengraph-image.png`],
		},
		robots: { index: true, follow: true },
	};
};

const LandingRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const dict = await getDictionary(lang);
	const { description } = dict.landing.meta;
	const url = `${SITE_URL}/${lang}`;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Mott Larbe",
		url,
		description,
		inLanguage: lang,
		potentialAction: {
			"@type": "SearchAction",
			target: { "@type": "EntryPoint", urlTemplate: `${url}/texts?q={search_term_string}` },
			"query-input": "required name=search_term_string",
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
			/>
			<LandingPage />
		</>
	);
};

export default LandingRoutePage;
