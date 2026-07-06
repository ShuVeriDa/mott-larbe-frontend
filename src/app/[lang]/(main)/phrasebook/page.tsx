import { phrasebookApi, phrasebookKeys } from "@/entities/phrasebook";
import { getDictionary, LOCALES } from "@/i18n/locales";
import { requireLocale } from "@/shared/lib/i18n";
import { getQueryClient } from "@/shared/lib/query-client";
import { buildAlternates, buildOpenGraph } from "@/shared/lib/seo";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { PhrasebookPageSkeleton } from "@/widgets/phrasebook-page";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import PhrasebookJsonLd from "./phrasebook-json-ld";

const PhrasebookPage = dynamic(
	() => import("@/widgets/phrasebook-page").then(m => m.PhrasebookPage),
	{ loading: () => <PhrasebookPageSkeleton /> },
);

export const generateStaticParams = () => LOCALES.map(lang => ({ lang }));

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	requireLocale(lang);

	const dict = await getDictionary(lang);
	const path = "/phrasebook";
	const { title, description } = dict.phrasebook.meta;
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

const PhrasebookRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	requireLocale(lang);

	const dict = await getDictionary(lang);
	const { title, description } = dict.phrasebook.meta;

	const queryClient = getQueryClient();
	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: phrasebookKeys.categories(),
			queryFn: () => phrasebookApi.categories(),
			staleTime: 5 * 60 * 1000,
		}),
		queryClient.prefetchQuery({
			queryKey: phrasebookKeys.stats(),
			queryFn: () => phrasebookApi.stats(),
			staleTime: 2 * 60 * 1000,
		}),
		queryClient.prefetchInfiniteQuery({
			queryKey: phrasebookKeys.phrases({}),
			queryFn: ({ pageParam }) =>
				phrasebookApi.phrases({ page: pageParam as number, limit: 30 }),
			initialPageParam: 1,
		}),
	]);

	return (
		<>
			<PhrasebookJsonLd lang={lang} title={title} description={description} />
			<ErrorBoundary fallback={<PhrasebookPageSkeleton />}>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<PhrasebookPage />
				</HydrationBoundary>
			</ErrorBoundary>
		</>
	);
};

export default PhrasebookRoutePage;
