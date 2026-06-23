import { type NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/locale-list";

const ACCESS_TOKEN_COOKIE = "access_token";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9555/api";

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
	!isPublicOnlyRoute(segment);

// Calls the backend refresh endpoint. The backend sets access_token via
// Set-Cookie (httpOnly) in the response — we forward those cookies to the
// browser via NextResponse.
const tryRefresh = async (
	request: NextRequest,
): Promise<Response | null> => {
	try {
		const res = await fetch(`${API_URL}/auth/login/access-token`, {
			method: "POST",
			headers: { cookie: request.headers.get("cookie") ?? "" },
		});
		if (!res.ok) return null;
		return res;
	} catch {
		return null;
	}
};

const forwardSetCookies = (from: Response, to: NextResponse): void => {
	for (const value of from.headers.getSetCookie()) {
		to.headers.append("Set-Cookie", value);
	}
};

export const proxy = async (request: NextRequest) => {
	const { pathname } = request.nextUrl;

	if (pathname.includes("/.well-known/")) return NextResponse.next();

	// Static uploads served by the backend — proxy directly, skip locale logic
	if (pathname.startsWith("/uploads/")) {
		return NextResponse.rewrite(new URL(pathname, API_URL.replace(/\/api$/, "")));
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

	// Skip refresh on public routes — the user is not authenticated and
	// there is no point attempting a refresh on the auth/landing pages.
	// This prevents parallel middleware calls from triggering concurrent
	// refresh attempts, which would cause token-rotation race conditions on
	// the backend (second refresh sees an already-rotated hash → all sessions
	// revoked → request storm of 401 / 429 errors).
	if (isPublicOnlyRoute(segment)) return buildNext();

	// No access token — attempt silent refresh via httpOnly refresh token cookie.
	// The backend will issue a new access_token cookie via Set-Cookie.
	const refreshRes = await tryRefresh(request);

	if (refreshRes) {
		const res = buildNext();
		forwardSetCookies(refreshRes, res);
		return res;
	}

	// Not authenticated
	if (isProtectedRoute(segment)) {
		return buildRedirect(`/${locale}/auth`);
	}

	return buildNext();
};

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|twitter-image|manifest|icon|apple-icon|sw\\.js|\\.well-known).*)",
	],
};
