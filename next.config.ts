import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
