import type { Metadata } from "next";
import {
	DEFAULT_LOCALE,
	LOCALES,
	getDictionary,
} from "@/i18n/locales";
import { ResetPasswordPage } from "@/widgets/reset-password-page";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

const PATH = "/reset-password";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!guardLocaleMetadata(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = dict.auth.resetPassword.meta;

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
		twitter: {
			card: "summary",
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

const ResetPasswordRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	requireLocale(lang);

	const dict = await getDictionary(lang);
	const meta = dict.auth.resetPassword.meta;
	const url = `${SITE_URL}/${lang}${PATH}`;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: meta.title,
		description: meta.description,
		url,
		inLanguage: lang,
		isPartOf: {
			"@type": "WebSite",
			name: "Mott Larbe",
			url: `${SITE_URL}/${lang}`,
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: structured data
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
			/>
			<ResetPasswordPage />
		</>
	);
};

export default ResetPasswordRoutePage;
