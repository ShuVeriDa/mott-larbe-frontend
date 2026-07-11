import { type NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/locale-list";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refreshToken";
// May be a same-origin relative path (e.g. "/api" for single-tunnel ngrok dev —
// see next.config.ts's rewrites()), which has no origin to rewrite a request
// against here. Fall back to the real backend host in that case, mirroring
// next.config.ts's own devApiProxyTarget resolution.
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9555/api";
const BACKEND_ORIGIN = rawApiUrl.startsWith("/")
	? (process.env.DEV_API_PROXY_TARGET ?? "http://localhost:9555")
	: rawApiUrl.replace(/\/api$/, "");

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

// Segment after locale: null = landing root, "auth"|"reset-password" = signed-out-only
// auth pages (a signed-in user is bounced to /dashboard from these).
const isPublicOnlyRoute = (segment: string | null): boolean =>
	segment === null || segment === "auth" || segment === "reset-password";

// Public evergreen guide content — crawlable by anonymous visitors and search
// engines, but also fine to view while signed in (unlike isPublicOnlyRoute,
// this must NOT bounce an authenticated visitor to /dashboard).
const PUBLIC_GUIDE_SEGMENTS = new Set(["script-guide", "pwa-guide"]);

const getRouteSegment = (pathname: string): string | null => {
	const parts = pathname.split("/");
	const segment = parts[2];
	return segment || null;
};

const isAlwaysAccessibleRoute = (segment: string | null): boolean =>
	isPublicOnlyRoute(segment) || PUBLIC_GUIDE_SEGMENTS.has(segment ?? "");

const isProtectedRoute = (segment: string | null): boolean =>
	!isAlwaysAccessibleRoute(segment);

export const proxy = async (request: NextRequest) => {
	const { pathname } = request.nextUrl;

	if (pathname.includes("/.well-known/")) return NextResponse.next();

	// Static uploads served by the backend — proxy directly, skip locale logic
	if (pathname.startsWith("/uploads/")) {
		return NextResponse.rewrite(new URL(pathname, BACKEND_ORIGIN));
	}
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

	const buildNext = () => {
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set("x-locale", locale);
		return NextResponse.next({ request: { headers: requestHeaders } });
	};

	const buildRedirect = (path: string) =>
		NextResponse.redirect(new URL(path, request.url));

	const existingToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

	if (existingToken) {
		if (isPublicOnlyRoute(segment)) {
			return buildRedirect(`/${locale}/dashboard`);
		}
		return buildNext();
	}

	if (isAlwaysAccessibleRoute(segment)) return buildNext();

	// No access token cookie (expired or never issued). Do NOT attempt a
	// server-side refresh here — the client-side axios interceptor in
	// shared/api/http.ts is the single source of truth for token refresh.
	// Having both the proxy and the interceptor call the refresh endpoint
	// independently caused a rotation race: two refresh requests could reach
	// the backend with the same still-valid refresh token, the loser would be
	// treated as token replay, and the backend would revoke every session —
	// logging the user out roughly every hour regardless of "remember me".
	//
	// If a refresh token cookie is present, optimistically let the request
	// through — the page loads, the first client-side API call gets a 401,
	// and the interceptor refreshes the access token and retries. If there is
	// no refresh token either, the user is truly signed out.
	const hasRefreshToken = Boolean(
		request.cookies.get(REFRESH_TOKEN_COOKIE)?.value,
	);

	if (hasRefreshToken) return buildNext();

	// Not authenticated
	if (isProtectedRoute(segment)) {
		return buildRedirect(`/${locale}/auth`);
	}

	return buildNext();
};

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|twitter-image|manifest|icon|apple-icon|sw\\.js|\\.well-known).*)",
	],
};
