import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES, getDictionary } from "@/i18n/locales";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";
import { AdminDashboardPage } from "@/widgets/admin-dashboard-page";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!guardLocaleMetadata(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = (
		dict as Record<string, unknown> & {
			admin?: { dashboard?: { meta?: { title?: string; description?: string } } };
		}
	)?.admin?.dashboard?.meta;

	const title = meta?.title ?? "Dashboard — Admin | Mott Larbe";
	const description = meta?.description ?? "Platform overview: users, content, revenue and activity";
	const path = "/admin/dashboard";

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
			type: "website",
			url: `${SITE_URL}/${lang}${path}`,
			title,
			description,
			locale: lang,
			siteName: "Mott Larbe",
		},
		robots: {
			index: false,
			follow: false,
		},
	};
};

interface PageProps {
	params: Promise<{ lang: string }>;
}

const AdminDashboardRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	requireLocale(lang);

	return <AdminDashboardPage />;
};

export default AdminDashboardRoutePage;
