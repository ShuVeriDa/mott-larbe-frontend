import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	DEFAULT_LOCALE,
	LOCALES,
	getDictionary,
	hasLocale,
} from "@/i18n/locales";
import { AdminDictionaryDetailPage } from "@/widgets/admin-dictionary-detail";

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = (
		dict as Record<string, unknown> & {
			admin?: {
				dictionaryDetail?: {
					meta?: { title?: string; description?: string };
				};
			};
		}
	)?.admin?.dictionaryDetail?.meta;

	const title = meta?.title ?? "Dictionary Entry — Admin | Mott Larbe";
	const description =
		meta?.description ?? "View and edit dictionary entry details, senses, examples and morphological forms";

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}/admin/dictionary`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}/admin/dictionary`;

	return {
		title,
		description,
		alternates: {
			canonical: `${SITE_URL}/${lang}/admin/dictionary`,
			languages,
		},
		openGraph: {
			type: "website",
			url: `${SITE_URL}/${lang}/admin/dictionary`,
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

const Page = async ({ params }: PageProps) => {
	const { lang, id } = await params;
	if (!hasLocale(lang)) notFound();

	return <AdminDictionaryDetailPage lemmaId={id} />;
};

export default Page;
