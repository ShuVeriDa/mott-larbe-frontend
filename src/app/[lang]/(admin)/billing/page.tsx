import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	DEFAULT_LOCALE,
	LOCALES,
	getDictionary,
	hasLocale,
} from "@/i18n/locales";
import { AdminSubscriptionsPage } from "@/widgets/admin-subscriptions-page";

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
			admin?: { meta?: { subscriptions?: { title?: string; description?: string } } };
		}
	)?.admin?.meta?.subscriptions;

	const title = meta?.title ?? "Subscriptions — Admin | Mott Larbe";
	const description =
		meta?.description ?? "Manage user subscriptions and billing";
	const path = "/admin/billing";

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

const Page = async ({ params }: PageProps) => {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	return <AdminSubscriptionsPage />;
};

export default Page;
