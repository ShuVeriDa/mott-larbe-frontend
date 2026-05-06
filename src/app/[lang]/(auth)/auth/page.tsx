import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	DEFAULT_LOCALE,
	LOCALES,
	getDictionary,
	hasLocale,
} from "@/i18n/locales";
import { AuthPage, type AuthMode } from "@/widgets/auth-page";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

const PATH = "/auth";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
	searchParams: Promise<{ mode?: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	const { mode } = await props.searchParams;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const meta =
		mode === "register" ? dict.auth.meta.register : dict.auth.meta.login;

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
			follow: true,
		},
	};
};

interface PageProps {
	params: Promise<{ lang: string }>;
	searchParams: Promise<{ mode?: string }>;
}

const AuthRoutePage = async ({ params, searchParams }: PageProps) => {
	const { lang } = await params;
	const { mode } = await searchParams;
	if (!hasLocale(lang)) notFound();

	const dict = await getDictionary(lang);
	const initialMode: AuthMode = mode === "register" ? "register" : "login";
	const meta =
		initialMode === "register"
			? dict.auth.meta.register
			: dict.auth.meta.login;
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
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<AuthPage initialMode={initialMode} />
		</>
	);
};

export default AuthRoutePage;
