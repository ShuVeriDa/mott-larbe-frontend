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
			"script-src 'self' 'unsafe-inline'", // fallback only; middleware overrides with nonce
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data: blob: https:",
			"font-src 'self'",
			`connect-src 'self' ${apiOrigin}`,
			"frame-ancestors 'none'",
			"base-uri 'self'",
			"form-action 'self'",
		].join("; "),
	},
];

const nextConfig: NextConfig = {
	allowedDevOrigins: isDev ? ["192.168.31.52"] : [],
	trailingSlash: false,
	reactCompiler: true,
	cacheComponents: true,
	experimental: {
		optimizePackageImports: ["lucide-react", "framer-motion"],
	},
	async redirects() {
		return [
			{ source: "/index", destination: "/", permanent: true },
			{ source: "/home",  destination: "/", permanent: true },
		];
	},
	images: {
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
				source: "/:lang(che|ru|en)/(reader|review|dashboard|admin|profile|settings|progress)(.*)",
				headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
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
