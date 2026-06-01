import { NextResponse, type NextRequest } from "next/server";

// Locales that have [lang] routes
const SUPPORTED_LOCALES = ["ru", "en", "che"];
const DEFAULT_LOCALE = "ru";

// Segments that must NOT get the locale prefix (files, API, _next)
const PUBLIC_FILE_RE = /\.(.*)$/;
const SKIP_PREFIXES = ["/_next", "/api", "/icons", "/manifest", "/sw.js", "/robots.txt", "/sitemap.xml", "/opengraph-image"];

const getApiOrigin = (): string => {
	const url = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9555";
	try {
		return new URL(url).origin;
	} catch {
		return url;
	}
};

const buildCsp = (nonce: string): string => {
	const apiOrigin = getApiOrigin();
	return [
		"default-src 'self'",
		// strict-dynamic + nonce replaces unsafe-inline/unsafe-eval
		`script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
		"style-src 'self' 'unsafe-inline'", // inline styles still needed for Tailwind/Next
		"img-src 'self' data: blob: https:",
		"font-src 'self'",
		`connect-src 'self' ${apiOrigin}`,
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'",
	].join("; ");
};

export const middleware = (request: NextRequest): NextResponse => {
	const { pathname } = request.nextUrl;

	// Skip static files and internal Next.js paths
	if (
		PUBLIC_FILE_RE.test(pathname) ||
		SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))
	) {
		return NextResponse.next();
	}

	// ── Locale routing ──────────────────────────────────────────────────────
	const pathnameHasLocale = SUPPORTED_LOCALES.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
	);

	if (!pathnameHasLocale) {
		const locale =
			request.cookies.get("NEXT_LOCALE")?.value ??
			request.headers.get("accept-language")?.split(",")[0]?.split("-")[0]?.toLowerCase() ??
			DEFAULT_LOCALE;

		const resolvedLocale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
		const url = request.nextUrl.clone();
		url.pathname = `/${resolvedLocale}${pathname}`;
		return NextResponse.redirect(url, 308);
	}

	// ── Nonce-based CSP ─────────────────────────────────────────────────────
	const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString("base64");
	const csp = buildCsp(nonce);

	const response = NextResponse.next({
		request: {
			headers: new Headers({
				...Object.fromEntries(request.headers.entries()),
				"x-nonce": nonce,
				"x-locale": pathname.split("/")[1] ?? DEFAULT_LOCALE,
			}),
		},
	});

	response.headers.set("Content-Security-Policy", csp);
	response.headers.set("x-nonce", nonce);

	return response;
};

export const config = {
	matcher: [
		// Match all paths except static files and Next.js internals
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
