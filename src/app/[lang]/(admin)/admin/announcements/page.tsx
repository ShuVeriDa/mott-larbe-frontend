import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/locales";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";
import { AdminAnnouncementsPage } from "@/widgets/admin-announcements-page";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";
const PATH = "/admin/announcements";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!guardLocaleMetadata(lang)) return {};

	const title = "Объявления — Admin";
	const description = "Управление объявлениями платформы: создание и рассылка уведомлений всем пользователям Mott Larbe. Административный раздел.";

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${PATH}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${PATH}`;

	return {
		title,
		description,
		alternates: {
			canonical: `${SITE_URL}/${lang}${PATH}`,
			languages,
		},
		openGraph: {
			type: "website",
			url: `${SITE_URL}/${lang}${PATH}`,
			title,
			description,
			locale: lang,
			siteName: "Mott Larbe",
		},
		robots: { index: false, follow: false },
	};
};

interface PageProps {
	params: Promise<{ lang: string }>;
}

const AdminAnnouncementsRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	requireLocale(lang);
	return <AdminAnnouncementsPage />;
};

export default AdminAnnouncementsRoutePage;
