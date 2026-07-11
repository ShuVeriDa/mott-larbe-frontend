import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Derive the API origin from NEXT_PUBLIC_API_URL so connect-src covers it.
// Falls back to localhost for local development.
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9555";
const apiOrigin = (() => {
	try {
		const { origin } = new URL(apiUrl);
		return origin;
	} catch {
		return apiUrl;
	}
})();

// Derive the WebSocket origin: http(s):// → ws(s)://
const wsOrigin = apiOrigin.replace(/^http(s?):\/\//, "ws$1://");

const securityHeaders = [
	// Prevent browsers from MIME-sniffing the content type.
	{ key: "X-Content-Type-Options", value: "nosniff" },
	// Disallow embedding this site in iframes (clickjacking protection).
	{ key: "X-Frame-Options", value: "DENY" },
	// Limit referrer information sent to cross-origin requests.
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	// Disable access to sensitive browser features we don't use.
	{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
	// Force HTTPS for 2 years in production (skip in dev to avoid localhost issues).
	...(isDev
		? []
		: [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
	// CSP is set dynamically per-request by middleware (nonce + strict-dynamic).
	// This static header is a fallback for paths that bypass middleware
	// (e.g. _next/static, direct asset requests).
	{
		key: "Content-Security-Policy",
		value: [
			"default-src 'self'",
			`script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`, // fallback only; middleware overrides with nonce
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data: blob: https:",
			"font-src 'self'",
			`connect-src 'self' ${apiOrigin} ${wsOrigin}`,
			"frame-ancestors 'none'",
			"base-uri 'self'",
			"form-action 'self'",
		].join("; "),
	},
];

// Extra dev origins (LAN IP, ngrok tunnel domain, etc.) via comma-separated env var,
// e.g. NEXT_DEV_ORIGINS="abcd1234.ngrok-free.app,192.168.31.52"
const extraDevOrigins = (process.env.NEXT_DEV_ORIGINS ?? "")
	.split(",")
	.map(origin => origin.trim())
	.filter(Boolean);

// When testing through a single ngrok tunnel (frontend only, including a
// production build for that testing), the browser must call the API on the
// SAME origin as the page — otherwise the backend's auth cookies (Domain=
// <backend host>) never reach this app's proxy.ts middleware, since cookies
// don't cross hostnames. Setting DEV_API_PROXY_TARGET rewrites /api/* and
// /uploads/* to the local backend server-side, so the browser only ever talks
// to one origin, exactly like the plain localhost setup. Not gated on isDev:
// ngrok testing is sometimes done against a production build.
const devApiProxyTarget = process.env.DEV_API_PROXY_TARGET;

const nextConfig: NextConfig = {
	allowedDevOrigins: isDev ? ["192.168.31.52", ...extraDevOrigins] : [],
	trailingSlash: false,
	reactCompiler: true,
	env: {
		NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
	},
	cacheComponents: true,
	experimental: {
		optimizePackageImports: ["lucide-react", "framer-motion"],
		viewTransition: true,
	},
	async rewrites() {
		if (!devApiProxyTarget) return [];
		return [
			{ source: "/api/:path*", destination: `${devApiProxyTarget}/api/:path*` },
			{ source: "/uploads/:path*", destination: `${devApiProxyTarget}/uploads/:path*` },
		];
	},
	async redirects() {
		return [
			{ source: "/index", destination: "/", permanent: true },
			{ source: "/home",  destination: "/", permanent: true },
			{ source: "/:lang(che|ru|en)/script-guide/arabic", destination: "/:lang/script-guide?tab=arabic", permanent: true },
			{ source: "/:lang(che|ru|en)/script-guide/latin",  destination: "/:lang/script-guide?tab=latin",  permanent: true },
			{ source: "/:lang(che|ru|en)/suggest-text", destination: "/:lang/my-texts/submit/new", permanent: true },
		];
	},
	images: {
		qualities: [75, 90],
		remotePatterns: [
			{ protocol: "https", hostname: "**" },
			// http allowed only in dev (local backend covers, avatar sources, etc.)
			...(isDev ? [{ protocol: "http" as const, hostname: "**" }] : []),
		],
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: securityHeaders,
			},
			{
				source: "/:lang(che|ru|en)/(reader|review|dashboard|admin|profile|settings|progress|subscription|my-texts|vocabulary|texts|phrasebook|feedback)(.*)",
				headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
			},
			{
				source: "/:lang(che|ru|en)/reset-password",
				headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
			},
			{
				source: "/sw.js",
				headers: [
					{ key: "Content-Type", value: "application/javascript; charset=utf-8" },
					{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
					{ key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
				],
			},
		];
	},
};

export default nextConfig;
