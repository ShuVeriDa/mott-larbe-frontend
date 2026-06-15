import { DEFAULT_LOCALE, LOCALES } from "@/i18n/locales";
import { AdminGenresPage } from "@/widgets/admin-genres-page";
import type { Metadata } from "next";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!guardLocaleMetadata(lang)) return {};

	const path = "/admin/genres";
	const title = "Жанры — Admin | Mott Larbe";
	const description = "Управление жанрами текстов библиотеки";

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${path}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

	return {
		title,
		description,
		alternates: { canonical: `${SITE_URL}/${lang}${path}`, languages },
		openGraph: { type: "website", url: `${SITE_URL}/${lang}${path}`, title, description, locale: lang, siteName: "Mott Larbe" },
		robots: { index: false, follow: false },
	};
};

interface PageProps {
	params: Promise<{ lang: string }>;
}

const AdminGenresRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	requireLocale(lang);
	return <AdminGenresPage />;
};

export default AdminGenresRoutePage;
