import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, getDictionary, hasLocale } from "@/i18n/locales";
import { AdminTextVersionsPage } from "@/widgets/admin-text-versions-page";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> => {
	const { lang, id } = await props.params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = (dict as Record<string, unknown> & {
		admin?: { texts?: { versions?: { meta?: { title?: string; description?: string } } } };
	})?.admin?.texts?.versions?.meta;

	const title = meta?.title ?? "Versions — Admin | Mott Larbe";
	const description = meta?.description ?? "Text processing version history";
	const path = `/admin/texts/${id}/versions`;

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
	params: Promise<{ lang: string; id: string }>;
}

const AdminTextVersionsRoutePage = async ({ params }: PageProps) => {
	const { lang, id } = await params;
	if (!hasLocale(lang)) notFound();

	return <AdminTextVersionsPage textId={id} />;
};

export default AdminTextVersionsRoutePage;
