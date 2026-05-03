import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	DEFAULT_LOCALE,
	LOCALES,
	hasLocale,
} from "@/i18n/locale-list";
import { getDictionary } from "@/i18n/locales";
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
	const isRegister = mode === "register";
	const meta = isRegister ? dict.auth.meta.register : dict.auth.meta.login;

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

	const initialMode: AuthMode = mode === "register" ? "register" : "login";
	return <AuthPage initialMode={initialMode} />;
};

export default AuthRoutePage;
