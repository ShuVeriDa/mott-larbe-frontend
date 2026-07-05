import { Suspense } from "react";
import type { Metadata } from "next";
import { LOCALES, getDictionary } from "@/i18n/locales";
import { buildAlternates, buildOpenGraph } from "@/shared/lib/seo";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { Skeleton } from "@/shared/ui/skeleton";
import { PwaInstallGuidePage, getPwaGuideContent } from "@/widgets/pwa-install-guide-page";

export const generateStaticParams = async () => LOCALES.map(lang => ({ lang }));

interface PageProps {
	params: Promise<{ lang: string }>;
}

interface PwaGuideMeta {
	pwaInstall?: { meta?: { title?: string; description?: string } };
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
	const { lang } = await params;
	if (!guardLocaleMetadata(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = (dict as PwaGuideMeta).pwaInstall?.meta;
	const title = meta?.title ?? "Install as an app — Mott Larbe";
	const description = meta?.description ?? "";
	const { canonical, languages } = buildAlternates(lang, "/pwa-guide");

	return {
		title,
		description,
		alternates: { canonical, languages },
		openGraph: buildOpenGraph(lang, "/pwa-guide", title, description),
		robots: { index: true, follow: true },
	};
};

const PwaGuideRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	requireLocale(lang);

	const dict = await getDictionary(lang);
	const content = getPwaGuideContent(dict);

	return (
		<ErrorBoundary fallback={<div className="p-8 text-t-3 text-sm">Something went wrong.</div>}>
			<Suspense fallback={<Skeleton className="h-screen w-full" />}>
				<PwaInstallGuidePage content={content} />
			</Suspense>
		</ErrorBoundary>
	);
};

export default PwaGuideRoutePage;
