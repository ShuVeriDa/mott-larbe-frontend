import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/locales";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

const PUBLIC_ROUTES = [
	"/",
	"/texts",
	"/suggest-text",
	"/suggestions",
	"/feedback",
	"/phrasebook",
];

export default function sitemap(): MetadataRoute.Sitemap {
	const entries: MetadataRoute.Sitemap = [];

	for (const route of PUBLIC_ROUTES) {
		const languages: Record<string, string> = {};
		for (const locale of LOCALES) {
			const path = route === "/" ? "" : route;
			languages[locale] = `${SITE_URL}/${locale}${path}`;
		}

		for (const locale of LOCALES) {
			const path = route === "/" ? "" : route;
			entries.push({
				url: `${SITE_URL}/${locale}${path}`,
				lastModified: new Date(),
				changeFrequency: "weekly",
				priority: route === "/" ? 1.0 : route === "/suggest-text" ? 0.7 : 0.8,
				alternates: {
					languages,
				},
			});
		}
	}

	return entries;
}
