import { getDictionary, LOCALES } from "@/i18n/locales";
import { libraryTextApi, libraryTextKeys } from "@/entities/library-text";
import { getQueryClient } from "@/shared/lib/query-client";
import { buildAlternates, buildOpenGraph, SITE_URL } from "@/shared/lib/seo";
import { TextsCatalogSkeleton } from "@/widgets/texts-catalog-page/ui/texts-catalog-skeleton";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { requireLocale } from "@/shared/lib/i18n";

const TextsCatalogPage = dynamic(
	() => import("@/widgets/texts-catalog-page").then((m) => m.TextsCatalogPage),
	{ loading: () => <TextsCatalogSkeleton /> },
);

export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

interface PageProps {
	params: Promise<{ lang: string }>;
}

export const generateMetadata = async ({
	params,
}: PageProps): Promise<Metadata> => {
	const { lang } = await params;
	requireLocale(lang);

	const dict = await getDictionary(lang);
	const path = "/texts";
	const { title, description } = dict.library.meta;
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
		robots: { index: true, follow: true },
	};
};

const TextsJsonLd = ({
	lang,
	title,
	description,
}: {
	lang: string;
	title: string;
	description: string;
}) => {
	const pageUrl = `${SITE_URL}/${lang}/texts`;
	const homeUrl = `${SITE_URL}/${lang}`;

	const schema = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "CollectionPage",
				"@id": pageUrl,
				url: pageUrl,
				name: title,
				description,
				inLanguage: lang,
				isPartOf: { "@id": homeUrl },
			},
			{
				"@type": "BreadcrumbList",
				itemListElement: [
					{
						"@type": "ListItem",
						position: 1,
						name: "Mott Larbe",
						item: homeUrl,
					},
					{
						"@type": "ListItem",
						position: 2,
						name: title,
						item: pageUrl,
					},
				],
			},
		],
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
		/>
	);
};

const TextsCatalogRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	requireLocale(lang);

	const dict = await getDictionary(lang);
	const { title, description } = dict.library.meta;

	const queryClient = getQueryClient();
	await queryClient.prefetchInfiniteQuery({
		queryKey: libraryTextKeys.infinite({}),
		queryFn: ({ pageParam }) =>
			libraryTextApi.list({ page: pageParam as number, limit: 20 }),
		initialPageParam: 1,
	});

	return (
		<>
			<TextsJsonLd lang={lang} title={title} description={description} />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<TextsCatalogPage />
			</HydrationBoundary>
		</>
	);
};

export default TextsCatalogRoutePage;
