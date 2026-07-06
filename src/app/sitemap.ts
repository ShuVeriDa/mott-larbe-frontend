import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/locales";
import { SITE_URL, buildAlternates as buildSeoAlternates } from "@/shared/lib/seo";

// EXCLUDED routes (owner-private, noindexed — must NEVER be added here):
//   /texts, /texts/**  — library content is gated behind sign-in (robots: noindex)
//   /phrasebook        — gated behind sign-in (robots: noindex)
//   /my-texts/**       — private user text library (robots: noindex set in page metadata)
//   /vocabulary        — renders the signed-in user's personal dictionary (robots: noindex)
//   /suggestions       — per-user submissions dashboard (robots: noindex)
//   /feedback          — robots: noindex
// Adding these would mislead crawlers into indexing content that requires
// sign-in — the proxy redirects anonymous visitors (including crawlers)
// away from these routes to /auth, so they can never actually be indexed.

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
	{ path: "/",             priority: 1.0, changeFrequency: "daily" },
	{ path: "/script-guide", priority: 0.7, changeFrequency: "monthly" },
	{ path: "/pwa-guide",    priority: 0.5, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const entries: MetadataRoute.Sitemap = [];

	// Static routes — one entry per locale.
	// BUILD_TIME is injected at build time so the date is stable across requests
	// and doesn't mislead crawlers into thinking content changes every minute.
	const buildTime = new Date(process.env.NEXT_PUBLIC_BUILD_TIME ?? Date.now());

	for (const { path, priority, changeFrequency } of STATIC_ROUTES) {
		const localePath = path === "/" ? "" : path;
		const { languages } = buildSeoAlternates(LOCALES[0], localePath);
		for (const locale of LOCALES) {
			entries.push({
				url: `${SITE_URL}/${locale}${localePath}`,
				lastModified: buildTime,
				changeFrequency,
				priority,
				alternates: { languages },
			});
		}
	}

	return entries;
}
