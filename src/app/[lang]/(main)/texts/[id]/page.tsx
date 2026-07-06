import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, LOCALES } from "@/i18n/locales";
import { requireLocale } from "@/shared/lib/i18n";
import { LibraryTextDetailPage } from "@/widgets/library-text-detail-page";
import type { LibraryTextDetail } from "@/entities/library-text";
import { API_URL } from "@/shared/config";
import { SITE_URL, OG_LOCALES, buildAlternates } from "@/shared/lib/seo";

const fetchTextForSeo = cache(async (id: string): Promise<LibraryTextDetail | null> => {
	try {
		const res = await fetch(`${API_URL}/texts/${encodeURIComponent(id)}`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return null;
		return res.json() as Promise<LibraryTextDetail>;
	} catch {
		return null;
	}
});

const PAGE_SIZE = 500;

export const generateStaticParams = async () => {
	const ids: string[] = [];
	let page = 1;

	while (true) {
		try {
			const res = await fetch(
				`${API_URL}/texts?limit=${PAGE_SIZE}&page=${page}`,
				{ next: { revalidate: 3600 } },
			);
			if (!res.ok) break;
			const data = await res.json() as { items: { id: string }[] };
			const items = data.items ?? [];
			items.forEach(({ id }) => ids.push(id));
			if (items.length < PAGE_SIZE) break;
			page++;
		} catch {
			break;
		}
	}

	return LOCALES.flatMap((lang) => ids.map((id) => ({ lang, id })));
};

export const generateMetadata = async (props: {
	params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> => {
	const { lang, id } = await props.params;
	requireLocale(lang);

	const [dict, text] = await Promise.all([
		getDictionary(lang),
		fetchTextForSeo(id),
	]);

	if (!text) notFound();

	const fallbackMeta = dict.library.textDetail.meta;
	const path = `/texts/${encodeURIComponent(id)}`;
	const title = (text.title ?? fallbackMeta.title).slice(0, 60);
	const description = (text.description ?? fallbackMeta.description).slice(0, 160);
	const { canonical, languages } = buildAlternates(lang, path);

	return {
		title,
		description,
		alternates: { canonical, languages },
		openGraph: {
			type: "article",
			url: canonical,
			title,
			description,
			locale: OG_LOCALES[lang] ?? "ru_RU",
			siteName: "Mott Larbe",
			...(text.publishedAt ? { publishedTime: text.publishedAt } : {}),
			...(text.updatedAt ? { modifiedTime: text.updatedAt } : {}),
			...(text.author ? { authors: [text.author] } : {}),
			images: [
				text.imageUrl
					? { url: text.imageUrl, width: 1200, height: 630, alt: title }
					: { url: `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: title },
			],
		},
		twitter: {
			card: text.imageUrl ? "summary_large_image" : "summary",
			title,
			description,
			images: [text.imageUrl ?? `${SITE_URL}/og-default.png`],
		},
		robots: { index: false, follow: true },
	};
};

interface PageProps {
	params: Promise<{ lang: string; id: string }>;
}

const LANG_CODE: Record<string, string> = { CHE: "ce", RU: "ru", EN: "en" };

const TextDetailsRoutePage = async ({ params }: PageProps) => {
	const { lang, id } = await params;
	requireLocale(lang);

	const [dict, text] = await Promise.all([
		getDictionary(lang),
		fetchTextForSeo(id),
	]);
	if (!text) notFound();

	const encodedId = encodeURIComponent(id);
	const pageUrl = `${SITE_URL}/${lang}/texts/${encodedId}`;
	const textsUrl = `${SITE_URL}/${lang}/texts`;

	const jsonLd = [
		{
			"@context": "https://schema.org",
			"@type": "Article",
			headline: text.title,
			...(text.description ? { description: text.description } : {}),
			...(text.author ? { author: { "@type": "Person", name: text.author } } : {}),
			...(text.imageUrl ? { image: text.imageUrl } : {}),
			...(text.publishedAt ? { datePublished: text.publishedAt } : {}),
			...(text.updatedAt ? { dateModified: text.updatedAt } : {}),
			inLanguage: LANG_CODE[text.language] ?? "ru",
			url: pageUrl,
			publisher: {
				"@type": "Organization",
				name: "Mott Larbe",
				url: SITE_URL,
				logo: {
					"@type": "ImageObject",
					url: `${SITE_URL}/icons/icon-512x512.png`,
				},
			},
		},
		{
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Mott Larbe",
					item: `${SITE_URL}/${lang}`,
				},
				{
					"@type": "ListItem",
					position: 2,
					name: dict.library.title,
					item: textsUrl,
				},
				{
					"@type": "ListItem",
					position: 3,
					name: text.title,
					item: pageUrl,
				},
			],
		},
	];

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
			/>
			{/* Critical content for crawlers without JS.
			    Browsers with JS see the hydrated LibraryTextDetailPage instead. */}
			<noscript>
				<h1>{text.title}</h1>
				{text.author && <p>{text.author}</p>}
				{text.description && <p>{text.description}</p>}
				<a href={`/${lang}/reader/${encodedId}/p/1`}>Читать</a>
			</noscript>
			<LibraryTextDetailPage id={id} />
		</>
	);
};

export default TextDetailsRoutePage;
