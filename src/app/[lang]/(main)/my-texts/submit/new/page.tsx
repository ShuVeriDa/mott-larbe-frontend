import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, getDictionary, hasLocale } from "@/i18n/locales";
import { SITE_URL } from "@/shared/lib/seo";
import { SubmissionCreatePageClient } from "@/widgets/user-text-edit/ui/submission-create-page-client";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = dict.myTexts.meta;
	const path = "/my-texts/submit/new";

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${path}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

	return {
		title: meta.submitTitle,
		description: meta.description,
		alternates: { canonical: `${SITE_URL}/${lang}${path}`, languages },
		openGraph: {
			type: "website",
			url: `${SITE_URL}/${lang}${path}`,
			title: meta.submitTitle,
			description: meta.description,
			locale: lang,
			siteName: "Mott Larbe",
		},
		twitter: { card: "summary", title: meta.submitTitle, description: meta.description },
		robots: { index: false, follow: false },
	};
};

interface PageProps {
	params: Promise<{ lang: string }>;
}

const MyTextsSubmitNewPage = async ({ params }: PageProps) => {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	return <SubmissionCreatePageClient lang={lang} />;
};

export default MyTextsSubmitNewPage;
