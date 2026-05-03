import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	DEFAULT_LOCALE,
	LOCALES,
	getDictionary,
	hasLocale,
} from "@/i18n/locales";
import { AdminUnknownWordsPage } from "@/widgets/admin-unknown-words-page";

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = (
		dict as Record<string, unknown> & {
			admin?: {
				unknownWords?: { meta?: { title?: string; description?: string } };
			};
		}
	)?.admin?.unknownWords?.meta;

	const title = meta?.title ?? "Unknown Words — Admin | Mott Larbe";
	const description =
		meta?.description ??
		"Words the system could not recognize during tokenization";
	const path = "/admin/unknown-words";

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

const AdminUnknownWordsRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	return <AdminUnknownWordsPage />;
};

export default AdminUnknownWordsRoutePage;
