import type { Metadata } from "next";
import {
	DEFAULT_LOCALE,
	LOCALES,
	getDictionary,
} from "@/i18n/locales";
import { AdminCouponsPage } from "@/widgets/admin-coupons-page";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!guardLocaleMetadata(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = (
		dict as Record<string, unknown> & {
			admin?: { coupons?: { meta?: { title?: string; description?: string } } };
		}
	)?.admin?.coupons?.meta;

	const title = meta?.title ?? "Promo Codes — Admin | Mott Larbe";
	const description = meta?.description ?? "Manage discount codes and coupons";
	const path = "/admin/billing/coupons";

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
	requireLocale(lang);

	return <AdminCouponsPage />;
};

export default Page;
