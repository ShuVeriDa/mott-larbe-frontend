import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/locales";
import { API_URL } from "@/shared/config";
import { SITE_URL, buildAlternates as buildSeoAlternates } from "@/shared/lib/seo";

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
	{ path: "/",             priority: 1.0, changeFrequency: "daily" },
	{ path: "/texts",        priority: 0.9, changeFrequency: "daily" },
	{ path: "/phrasebook",   priority: 0.8, changeFrequency: "weekly" },
	{ path: "/suggestions",  priority: 0.7, changeFrequency: "weekly" },
	{ path: "/suggest-text", priority: 0.6, changeFrequency: "monthly" },
	{ path: "/feedback",     priority: 0.5, changeFrequency: "monthly" },
];

interface SitemapText {
	id: string;
	updatedAt?: string;
	createdAt?: string;
}

interface TextsPage {
	items: SitemapText[];
	limit: number;
}

const PAGE_SIZE = 1000;

const fetchPublicTexts = async (): Promise<SitemapText[]> => {
	const all: SitemapText[] = [];
	let page = 1;

	while (true) {
		try {
			const res = await fetch(
				`${API_URL}/texts?limit=${PAGE_SIZE}&page=${page}`,
				{ next: { revalidate: 3600 } },
			);
			if (!res.ok) break;
			const data = await res.json() as TextsPage;
			const items = data.items ?? [];
			all.push(...items);
			if (items.length < PAGE_SIZE) break;
			page++;
		} catch {
			break;
		}
	}

	return all;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const entries: MetadataRoute.Sitemap = [];

	// Static routes — one entry per locale
	for (const { path, priority, changeFrequency } of STATIC_ROUTES) {
		const localePath = path === "/" ? "" : path;
		const { languages } = buildSeoAlternates(LOCALES[0], localePath);
		for (const locale of LOCALES) {
			entries.push({
				url: `${SITE_URL}/${locale}${localePath}`,
				lastModified: new Date("2025-06-01"),
				changeFrequency,
				priority,
				alternates: { languages },
			});
		}
	}

	// Dynamic text pages — fetched from API
	const texts = await fetchPublicTexts();
	for (const text of texts) {
		const textPath = `/texts/${text.id}`;
		const { languages } = buildSeoAlternates(LOCALES[0], textPath);
		const lastModified =
			text.updatedAt ?? text.createdAt
				? new Date((text.updatedAt ?? text.createdAt)!)
				: new Date();

		for (const locale of LOCALES) {
			entries.push({
				url: `${SITE_URL}/${locale}${textPath}`,
				lastModified,
				changeFrequency: "monthly",
				priority: 0.7,
				alternates: { languages },
			});
		}
	}

	return entries;
}
