import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	DEFAULT_LOCALE,
	LOCALES,
	getDictionary,
	hasLocale,
} from "@/i18n/locales";
import { AdminUserDetailPage } from "@/widgets/admin-user-detail";

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = (
		dict as Record<
			string,
			unknown
		> & {
			admin?: {
				userDetail?: {
					meta?: { title?: string; description?: string };
				};
			};
		}
	)?.admin?.userDetail?.meta;

	const title = meta?.title ?? "User — Admin | Mott Larbe";
	const description =
		meta?.description ?? "View and manage user account details, roles, and activity";

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}/admin/users`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}/admin/users`;

	return {
		title,
		description,
		alternates: {
			canonical: `${SITE_URL}/${lang}/admin/users`,
			languages,
		},
		openGraph: {
			type: "website",
			url: `${SITE_URL}/${lang}/admin/users`,
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

	return <AdminUserDetailPage userId={id} />;
};

export default Page;
