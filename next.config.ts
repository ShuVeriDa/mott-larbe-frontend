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
};

export default nextConfig;
