import {
	DEFAULT_LOCALE,
	LOCALES,
	getDictionary,
	hasLocale,
} from "@/i18n/locales";
import { OG_LOCALES, SITE_URL } from "@/shared/lib/seo";
import { DashboardPageDynamic } from "@/widgets/dashboard-page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = dict.dashboard.meta;
	const path = "/dashboard";

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${path}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

	return {
		title: meta.title,
		description: meta.description,
		alternates: {
			canonical: `${SITE_URL}/${lang}${path}`,
			languages,
		},
		openGraph: {
			type: "website",
			url: `${SITE_URL}/${lang}${path}`,
			title: meta.title,
			description: meta.description,
			locale: OG_LOCALES[lang] ?? lang,
			siteName: "Mott Larbe",
		},
		twitter: {
			card: "summary_large_image",
			title: meta.title,
			description: meta.description,
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

const DashboardRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	return <DashboardPageDynamic />;
};

export default DashboardRoutePage;
