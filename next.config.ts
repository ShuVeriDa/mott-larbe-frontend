import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	allowedDevOrigins: ["192.168.31.52"],
	reactCompiler: true,
	experimental: {
		optimizePackageImports: ["lucide-react", "framer-motion"],
	},
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "**" },
			{ protocol: "http", hostname: "**" },
		],
	},
	async headers() {
		return [
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
