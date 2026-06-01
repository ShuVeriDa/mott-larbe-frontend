import { DEFAULT_LOCALE, LOCALES } from "@/i18n/locales";

export const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

// Maps internal locale codes to BCP-47 / OG locale format
export const OG_LOCALES: Record<string, string> = {
	che: "ce_CE",
	ru: "ru_RU",
	en: "en_US",
};

export const buildAlternates = (
	lang: string,
	path: string,
): { canonical: string; languages: Record<string, string> } => {
	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${path}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;
	return { canonical: `${SITE_URL}/${lang}${path}`, languages };
};

export const buildOpenGraph = (
	lang: string,
	path: string,
	title: string,
	description: string,
): Record<string, unknown> => ({
	type: "website",
	url: `${SITE_URL}/${lang}${path}`,
	title,
	description,
	locale: OG_LOCALES[lang] ?? lang,
	alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALES[l] ?? l),
	siteName: "Mott Larbe",
	images: [{ url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630 }],
});
