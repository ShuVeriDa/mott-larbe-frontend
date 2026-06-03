import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, getDictionary, hasLocale } from "@/i18n/locales";
import { SITE_URL } from "@/shared/lib/seo";
import { getQueryClient } from "@/shared/lib/query-client";
import { userTextDetailQueryOptions } from "@/entities/user-text";
import { UserTextEditPageClient } from "@/widgets/user-text-edit/ui/user-text-edit-page-client";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> => {
	const { lang, id } = await props.params;
	if (!hasLocale(lang)) return {};

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
	if (!hasLocale(lang)) notFound();

	// Server-side prefetch: populates cache before hydration
	const queryClient = getQueryClient();
	await queryClient.prefetchQuery(userTextDetailQueryOptions(id));

	return <UserTextEditPageClient id={id} lang={lang} />;
};

export default MyTextEditPage;
