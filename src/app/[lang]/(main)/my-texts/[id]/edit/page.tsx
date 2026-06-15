import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES, getDictionary } from "@/i18n/locales";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";
import { SITE_URL } from "@/shared/lib/seo";
import { UserTextEditPageClient } from "@/widgets/user-text-edit/ui/user-text-edit-page-client";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> => {
	const { lang, id } = await props.params;
	if (!guardLocaleMetadata(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = dict.myTexts.meta;
	const path = `/my-texts/${id}/edit`;

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${path}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

	return {
		title: meta.editTitle,
		description: meta.description,
		alternates: { canonical: `${SITE_URL}/${lang}${path}`, languages },
		openGraph: {
			type: "website",
			url: `${SITE_URL}/${lang}${path}`,
			title: meta.editTitle,
			description: meta.description,
			locale: lang,
			siteName: "Mott Larbe",
		},
		twitter: { card: "summary", title: meta.editTitle, description: meta.description },
		robots: { index: false, follow: false },
	};
};

interface PageProps {
	params: Promise<{ lang: string; id: string }>;
}

const MyTextEditPage = async ({ params }: PageProps) => {
	const { lang, id } = await params;
	requireLocale(lang);

	// No server-side prefetch — editor loads via dynamic({ ssr: false }),
	// so prefetched data would never reach the client before hydration anyway.
	// Data fetching happens client-side after mount.
	return <UserTextEditPageClient id={id} lang={lang} />;
};

export default MyTextEditPage;
