import type { Metadata } from "next";
import { getDictionary, LOCALES } from "@/i18n/locales";
import { buildAlternates, buildOpenGraph, SITE_URL } from "@/shared/lib/seo/metadata";
import { ReviewPageClient } from "@/widgets/review-page";
import { requireLocale } from "@/shared/lib/i18n";

export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	requireLocale(lang);

	const dict = await getDictionary(lang);
	const meta = dict.review.meta;

	return {
		title: meta.title,
		description: meta.description,
		alternates: buildAlternates(lang, "/review"),
		openGraph: buildOpenGraph(lang, "/review", meta.title, meta.description),
		twitter: {
			card: "summary_large_image",
			title: meta.title,
			description: meta.description,
			images: [`${SITE_URL}/opengraph-image.png`],
		},
		robots: {
			index: false,
			follow: false,
		},
	};
};

interface PageProps {
	params: Promise<{ lang: string }>;
}

const ReviewRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	requireLocale(lang);

	return <ReviewPageClient />;
};

export default ReviewRoutePage;
