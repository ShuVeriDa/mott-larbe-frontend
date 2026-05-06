import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, getDictionary, hasLocale } from "@/i18n/locales";
import { AdminPaymentsPage } from "@/widgets/admin-payments-page";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = (
		dict as Record<string, unknown> & {
			admin?: { payments?: { meta?: { title?: string; description?: string } } };
		}
	)?.admin?.payments?.meta;

	const title = meta?.title ?? "Payment History — Admin | Mott Larbe";
	const description =
		meta?.description ??
		"View, filter, export and refund user transactions";
	const path = "/admin/payments";

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

const AdminPaymentsRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	return <AdminPaymentsPage />;
};

export default AdminPaymentsRoutePage;
