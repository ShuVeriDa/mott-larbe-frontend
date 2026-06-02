import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, LOCALES } from "@/i18n/locales";
import { buildAlternates, buildOpenGraph, SITE_URL } from "@/shared/lib/seo/metadata";
import { ReviewPage } from "@/widgets/review-page";
import { ReviewPageSkeleton } from "@/widgets/review-page";
import { ErrorBoundary } from "@/shared/ui/error-boundary";

export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

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
	if (!hasLocale(lang)) notFound();

	return (
		<ErrorBoundary fallback={<ReviewPageSkeleton />}>
			<Suspense fallback={<ReviewPageSkeleton />}>
				<ReviewPage />
			</Suspense>
		</ErrorBoundary>
	);
};

export default ReviewRoutePage;
