import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/i18n/locales";
import { buildAlternates, buildOpenGraph } from "@/shared/lib/seo/metadata";
import { ReviewPage } from "@/widgets/review-page";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!hasLocale(lang)) notFound();

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
	if (!hasLocale(lang)) notFound();

	return <ReviewPage />;
};

export default ReviewRoutePage;
