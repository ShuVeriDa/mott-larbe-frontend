import { getDictionary, LOCALES } from "@/i18n/locales";
import { buildAlternates, buildOpenGraph, SITE_URL } from "@/shared/lib/seo";
import { VocabularyPage } from "@/widgets/vocabulary-page";
import type { Metadata } from "next";
import { requireLocale } from "@/shared/lib/i18n";

export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	requireLocale(lang);

	const dict = await getDictionary(lang);
	const path = "/vocabulary";
	const { title, description } = dict.vocabulary.meta;
	const { canonical, languages } = buildAlternates(lang, path);

	return {
		title,
		description,
		alternates: { canonical, languages },
		openGraph: buildOpenGraph(lang, path, title, description),
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [`${SITE_URL}/opengraph-image.png`],
		},
		robots: {
			index: false,
			follow: true,
		},
	};
};

interface PageProps {
	params: Promise<{ lang: string }>;
}

const VocabularyRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	requireLocale(lang);

	return <VocabularyPage />;
};

export default VocabularyRoutePage;
