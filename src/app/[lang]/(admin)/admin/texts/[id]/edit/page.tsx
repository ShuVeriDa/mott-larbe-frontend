import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, getDictionary, hasLocale } from "@/i18n/locales";
import { AdminTextEditPage } from "@/widgets/admin-text-edit";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = (
		dict as Record<string, unknown> & {
			admin?: { meta?: { textsEdit?: { title?: string; description?: string } } };
		}
	)?.admin?.meta?.textsEdit;

	const { id } = await props.params;
	const title = meta?.title ?? "Edit text — Admin | Mott Larbe";
	const description = meta?.description ?? "Edit library text content and metadata";
	const path = `/admin/texts/${id}/edit`;

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

const AdminTextEditRoutePage = async ({ params }: PageProps) => {
	const { lang, id } = await params;
	if (!hasLocale(lang)) notFound();

	return <AdminTextEditPage textId={id} />;
};

export default AdminTextEditRoutePage;
