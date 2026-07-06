import type { Metadata } from "next";
import { Suspense } from "react";
import {
	DEFAULT_LOCALE,
	LOCALES,
	getDictionary,
} from "@/i18n/locales";
import { AuthPage, isOAuthError, type AuthMode } from "@/widgets/auth-page";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";
import { getSafeRedirectPath } from "@/shared/lib/safe-redirect";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

const PATH = "/auth";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
	searchParams: Promise<{ mode?: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	const { mode } = await props.searchParams;
	if (!guardLocaleMetadata(lang)) return {};

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
	searchParams: Promise<{ mode?: string; error?: string; redirect?: string }>;
}

const AuthPageContent = async ({ params, searchParams }: PageProps) => {
	const { lang } = await params;
	const { mode, error, redirect } = await searchParams;
	requireLocale(lang);
	const redirectTo = getSafeRedirectPath(redirect);

	const dict = await getDictionary(lang);
	const initialMode: AuthMode = mode === "register" ? "register" : "login";
	const oauthError = isOAuthError(error) ? error : undefined;
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
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
			/>
			<AuthPage initialMode={initialMode} oauthError={oauthError} redirectTo={redirectTo} />
		</>
	);
};

const AuthRoutePage = (props: PageProps) => (
	<Suspense>
		<AuthPageContent {...props} />
	</Suspense>
);

export default AuthRoutePage;
