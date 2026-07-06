import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
	DEFAULT_LOCALE,
	LOCALES,
	getDictionary,
} from "@/i18n/locales";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";
import { readerContextQueryOptions } from "@/entities/reader-context";
import type { ReaderContextResponse } from "@/entities/reader-context";
import { textKeys } from "@/entities/text";
import { highlightKeys } from "@/entities/highlight";
import { noteKeys } from "@/entities/note";
import { ReaderPage, ReaderPageSkeleton } from "@/widgets/reader-page";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/shared/lib/query-client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

interface PageRouteParams {
	lang: string;
	textId: string;
	pageNumber: string;
}

const parsePage = (raw: string) => {
	const parsed = Number.parseInt(raw, 10);
	if (!Number.isFinite(parsed) || parsed < 1) return null;
	return parsed;
};

export const generateMetadata = async ({
	params,
}: {
	params: Promise<PageRouteParams>;
}): Promise<Metadata> => {
	const { lang, textId, pageNumber } = await params;
	if (!guardLocaleMetadata(lang)) return {};

	const page = parsePage(pageNumber);
	if (!page) return {};

	const dict = await getDictionary(lang);
	const meta = dict.reader.meta;
	const path = `/reader/${textId}/p/${page}`;

	const queryClient = getQueryClient();
	const opts = readerContextQueryOptions(textId, page);
	await queryClient.prefetchQuery(opts);
	const ctx = queryClient.getQueryData<ReaderContextResponse>(opts.queryKey);
	const pageData = ctx?.page;

	const rawTitle = meta.title.replace("{page}", String(page));
	const title = pageData?.title
		? rawTitle.replace("{textTitle}", pageData.title)
		: rawTitle.replace("{textTitle} · ", "");
	const imageUrl = pageData?.imageUrl ?? null;
	const description = meta.description;

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${path}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

	return {
		title,
		description,
		alternates: {
			canonical: `${SITE_URL}/${lang}${path}`,
			languages,
		},
		openGraph: {
			type: "article",
			url: `${SITE_URL}/${lang}${path}`,
			title,
			description,
			locale: lang,
			siteName: "Mott Larbe",
			...(imageUrl && { images: [{ url: imageUrl }] }),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			...(imageUrl && { images: [imageUrl] }),
		},
		robots: {
			index: false,
			follow: false,
		},
	};
};

interface ReaderPagePrefetchProps {
	textId: string;
	page: number;
}

// Isolated in its own Suspense boundary because the prefetch below goes through
// axios (readerContextApi), which Next's Cache Components model can't track as
// cached — without a boundary here it blocks the whole route shell from streaming.
const ReaderPagePrefetch = async ({ textId, page }: ReaderPagePrefetchProps) => {
	// generateMetadata already prefetched readerContext via the same cache()-wrapped
	// QueryClient — this is a no-op if metadata ran first, and a safety net if not.
	const queryClient = getQueryClient();
	const opts = readerContextQueryOptions(textId, page);
	await queryClient.prefetchQuery(opts);
	// Populate derived sub-keys so client hooks (useHighlights, useNotes, usePagePhrases)
	// find warm cache entries on first render without triggering their own fetches.
	// useReaderContext.queryFn does the same on subsequent client-side navigations.
	const ctx = queryClient.getQueryData<ReaderContextResponse>(opts.queryKey);
	if (ctx) {
		queryClient.setQueryData(textKeys.page(textId, page), ctx.page);
		queryClient.setQueryData(textKeys.phrases(textId, page), ctx.phrases);
		queryClient.setQueryData(highlightKeys.page(textId, page), ctx.highlights);
		queryClient.setQueryData(noteKeys.page(textId, page), ctx.notes);
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ReaderPage textId={textId} pageNumber={page} />
		</HydrationBoundary>
	);
};

const ReaderTextPageRoutePage = async ({
	params,
}: {
	params: Promise<PageRouteParams>;
}) => {
	const { lang, textId, pageNumber } = await params;
	requireLocale(lang);

	const page = parsePage(pageNumber);
	if (!page) notFound();

	return (
		<Suspense fallback={<ReaderPageSkeleton />}>
			<ReaderPagePrefetch textId={textId} page={page} />
		</Suspense>
	);
};

export default ReaderTextPageRoutePage;
