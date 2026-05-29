import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
	dest: "public",
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	reloadOnOnline: true,
	disable: process.env.NODE_ENV === "development",
	fallbacks: {
		document: "/offline",
	},
	workboxOptions: {
		disableDevLogs: true,
		// Cache strategy: network-first for API, cache-first for static assets
		runtimeCaching: [
			{
				// API calls — network first, fall back to cache
				urlPattern: /^https?:\/\/.*\/api\/.*/i,
				handler: "NetworkFirst",
				options: {
					cacheName: "api-cache",
					expiration: {
						maxEntries: 64,
						maxAgeSeconds: 60 * 60 * 24, // 24 hours
					},
					networkTimeoutSeconds: 10,
				},
			},
			{
				// Google Fonts stylesheets
				urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
				handler: "StaleWhileRevalidate",
				options: {
					cacheName: "google-fonts-stylesheets",
				},
			},
			{
				// Google Fonts files
				urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
				handler: "CacheFirst",
				options: {
					cacheName: "google-fonts-webfonts",
					expiration: {
						maxEntries: 20,
						maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
					},
				},
			},
			{
				// Images
				urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
				handler: "CacheFirst",
				options: {
					cacheName: "images",
					expiration: {
						maxEntries: 64,
						maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
					},
				},
			},
		],
	},
});

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "**" },
			{ protocol: "http", hostname: "**" },
		],
	},
};

export default withPWA(nextConfig);
