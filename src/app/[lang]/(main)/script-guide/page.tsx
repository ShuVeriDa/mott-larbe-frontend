import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, getDictionary, hasLocale } from "@/i18n/locales";
import { buildAlternates, buildOpenGraph } from "@/shared/lib/seo";
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
	if (!hasLocale(lang)) return {};

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
	if (!hasLocale(lang)) notFound();

	return (
		<ErrorBoundary fallback={<div className="p-8 text-t-3 text-sm">Something went wrong.</div>}>
			<Suspense fallback={<Skeleton className="h-screen w-full" />}>
				<ScriptGuidePage />
			</Suspense>
		</ErrorBoundary>
	);
};

export default ScriptGuideRoutePage;
