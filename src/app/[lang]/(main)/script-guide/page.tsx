import { Suspense } from "react";
import type { Metadata } from "next";
import { LOCALES, getDictionary } from "@/i18n/locales";
import { buildAlternates, buildOpenGraph, SITE_URL } from "@/shared/lib/seo";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { Skeleton } from "@/shared/ui/skeleton";
import { ScriptGuidePage } from "@/widgets/script-guide-page";

export const generateStaticParams = async () => LOCALES.map(lang => ({ lang }));

interface PageProps {
	params: Promise<{ lang: string }>;
}

interface ScriptGuideMeta {
	scriptGuide?: {
		meta?: {
			title?: string;
			description?: string;
		};
	};
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
	const { lang } = await params;
	if (!guardLocaleMetadata(lang)) return {};

	const dict = await getDictionary(lang);
	const sg = (dict as ScriptGuideMeta).scriptGuide;
	const title = sg?.meta?.title ?? "Script reading guide — Mott Larbe";
	const description = sg?.meta?.description ?? "";
	const { canonical, languages } = buildAlternates(lang, "/script-guide");

	return {
		title,
		description,
		alternates: { canonical, languages },
		openGraph: buildOpenGraph(lang, "/script-guide", title, description),
		robots: { index: true, follow: true },
	};
};

const ScriptGuideRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	requireLocale(lang);

	const dict = await getDictionary(lang);
	const sg = (dict as ScriptGuideMeta).scriptGuide;
	const title = sg?.meta?.title ?? "Script reading guide — Mott Larbe";
	const description = sg?.meta?.description ?? "";
	const url = `${SITE_URL}/${lang}/script-guide`;

	const articleJsonLd = {
		"@context": "https://schema.org",
		"@type": "LearningResource",
		"@id": `${url}/#learning-resource`,
		headline: title,
		name: title,
		description,
		url,
		inLanguage: lang,
		about: "Chechen script and orthography",
		learningResourceType: "Guide",
		educationalLevel: "Beginner",
	};

	return (
		<ErrorBoundary fallback={<div className="p-8 text-t-3 text-sm">Something went wrong.</div>}>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
			/>
			<Suspense fallback={<Skeleton className="h-screen w-full" />}>
				<ScriptGuidePage />
			</Suspense>
		</ErrorBoundary>
	);
};

export default ScriptGuideRoutePage;
