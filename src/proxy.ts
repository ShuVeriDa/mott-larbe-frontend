import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/locales";

const getPreferredLocale = (request: NextRequest): Locale => {
	const acceptLanguage = request.headers.get("accept-language") ?? "";

	const preferred = acceptLanguage
		.split(",")
		.map((part) => part.split(";")[0].trim().split("-")[0].toLowerCase());

	for (const lang of preferred) {
		if (LOCALES.includes(lang as Locale)) return lang as Locale;
	}

	return DEFAULT_LOCALE;
};

export const proxy = (request: NextRequest) => {
	const { pathname } = request.nextUrl;

	const matchedLocale = LOCALES.find(
		(locale) =>
			pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
	);

	if (matchedLocale) {
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set("x-locale", matchedLocale);
		return NextResponse.next({ request: { headers: requestHeaders } });
	}

	const locale = getPreferredLocale(request);
	const url = request.nextUrl.clone();
	url.pathname = `/${locale}${pathname}`;
	return NextResponse.redirect(url, 301);
};

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|twitter-image|manifest|icon|apple-icon).*)",
	],
};
