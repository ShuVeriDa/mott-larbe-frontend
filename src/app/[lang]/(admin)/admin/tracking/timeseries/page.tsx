import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, getDictionary, hasLocale } from "@/i18n/locales";
import { AdminTrackingTimeseriesPage } from "@/widgets/admin-tracking-timeseries-page";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";
const PATH = "/admin/tracking/timeseries";

export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = dict.admin.tracking.meta;

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${PATH}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${PATH}`;

	return {
		title: meta.title,
		description: meta.description,
		alternates: {
			canonical: `${SITE_URL}/${lang}${PATH}`,
			languages,
		},
		openGraph: {
			type: "website",
			url: `${SITE_URL}/${lang}${PATH}`,
			title: meta.title,
			description: meta.description,
			locale: lang,
			siteName: "Mott Larbe",
		},
		robots: { index: false, follow: false },
	};
};

interface PageProps {
	params: Promise<{ lang: string }>;
}

const AdminTrackingTimeseriesRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const dict = await getDictionary(lang);

	return <AdminTrackingTimeseriesPage lang={lang} dict={dict.admin.tracking} />;
};

export default AdminTrackingTimeseriesRoutePage;
