"use cache";

import type { Metadata } from "next";
import {
	LOCALES,
	getDictionary,
} from "@/i18n/locales";
import { buildAlternates, buildOpenGraph, SITE_URL } from "@/shared/lib/seo";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";
import { LandingPage } from "@/widgets/landing-page";

export const generateStaticParams = async () => LOCALES.map((lang) => ({ lang }));

interface PageProps {
	params: Promise<{ lang: string }>;
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!guardLocaleMetadata(lang)) return {};

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

interface FaqDictItem {
	q: string;
	a: string;
}

const LandingRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	requireLocale(lang);

	const dict = await getDictionary(lang);
	const { title, description } = dict.landing.meta;
	const url = `${SITE_URL}/${lang}`;

	const webPageJsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		"@id": `${url}/#webpage`,
		url,
		name: title,
		description,
		inLanguage: lang,
		isPartOf: { "@id": `${SITE_URL}/#website` },
	};

	const faqItems = (
		(dict as unknown as { landing?: { faq?: { items?: FaqDictItem[] } } })
			.landing?.faq?.items ?? []
	);

	const faqJsonLd = faqItems.length > 0
		? {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: faqItems.map(({ q, a }) => ({
				"@type": "Question",
				name: q,
				acceptedAnswer: { "@type": "Answer", text: a },
			})),
		}
		: null;

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd).replace(/</g, "\\u003c") }}
			/>
			{faqJsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
				/>
			)}
			<LandingPage />
		</>
	);
};

export default LandingRoutePage;
