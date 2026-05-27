import { type NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/locale-list";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refreshToken";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9555/api";

// Reads exp from the JWT payload (no verification — proxy just needs the TTL)
const getJwtExp = (token: string): number | null => {
	try {
		const payload = token.split(".")[1];
		const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
		return typeof decoded.exp === "number" ? decoded.exp : null;
	} catch {
		return null;
	}
};

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

const getLocaleFromPathname = (pathname: string): Locale => {
	const segment = pathname.split("/")[1];
	return (LOCALES as readonly string[]).includes(segment)
		? (segment as Locale)
		: DEFAULT_LOCALE;
};

// Segment after locale: null = landing root, "auth"|"reset-password" = public auth pages
const getRouteSegment = (pathname: string): string | null => {
	const parts = pathname.split("/");
	const segment = parts[2];
	return segment || null;
};

const isPublicOnlyRoute = (segment: string | null): boolean =>
	segment === null || segment === "auth" || segment === "reset-password";

const isProtectedRoute = (segment: string | null): boolean =>
	segment !== null && segment !== "auth" && segment !== "reset-password";

const tryRefresh = async (request: NextRequest): Promise<string | null> => {
	try {
		const res = await fetch(`${API_URL}/auth/login/access-token`, {
			method: "POST",
			headers: { cookie: request.headers.get("cookie") ?? "" },
		});
		if (!res.ok) return null;
		const data = (await res.json()) as { accessToken?: string };
		return data.accessToken ?? null;
	} catch {
		return null;
	}
};

export const proxy = async (request: NextRequest) => {
	const { pathname } = request.nextUrl;

	// Locale redirect for paths without a locale prefix
	const matchedLocale = LOCALES.find(
		(locale) =>
			pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
	);

	if (!matchedLocale) {
		const locale = getPreferredLocale(request);
		const url = request.nextUrl.clone();
		url.pathname = `/${locale}${pathname}`;
		return NextResponse.redirect(url, 301);
	}

	const locale = getLocaleFromPathname(pathname);
	const segment = getRouteSegment(pathname);

	// Mirror the refresh token's TTL for the access token cookie.
	// If the refresh token lives 30 days (rememberMe), access token cookie should too.
	const refreshTokenValue = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
	const refreshExp = refreshTokenValue ? getJwtExp(refreshTokenValue) : null;
	const maxAge = refreshExp ? Math.max(0, refreshExp - Math.floor(Date.now() / 1000)) : undefined;

	const tokenCookieOptions = {
		path: "/",
		sameSite: "lax" as const,
		httpOnly: false,
		...(maxAge !== undefined ? { maxAge } : {}),
	};

	const buildNext = (token?: string) => {
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set("x-locale", locale);
		const res = NextResponse.next({ request: { headers: requestHeaders } });
		if (token) {
			res.cookies.set(ACCESS_TOKEN_COOKIE, token, tokenCookieOptions);
		}
		return res;
	};

	const buildRedirect = (path: string, token?: string) => {
		const res = NextResponse.redirect(new URL(path, request.url));
		if (token) {
			res.cookies.set(ACCESS_TOKEN_COOKIE, token, tokenCookieOptions);
		}
		return res;
	};

	const existingToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

	if (existingToken) {
		if (isPublicOnlyRoute(segment)) {
			return buildRedirect(`/${locale}/dashboard`);
		}
		return buildNext();
	}

	// No token — attempt silent refresh via httpOnly refresh token cookie
	const newToken = await tryRefresh(request);

	if (newToken) {
		if (isPublicOnlyRoute(segment)) {
			return buildRedirect(`/${locale}/dashboard`, newToken);
		}
		return buildNext(newToken);
	}

	// Not authenticated
	if (isProtectedRoute(segment)) {
		return buildRedirect(`/${locale}/auth`);
	}

	return buildNext();
};

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|twitter-image|manifest|icon|apple-icon).*)",
	],
};
