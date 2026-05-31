import type { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => ({
	name: "Мотт Ларбе",
	short_name: "Мотт Ларбе",
	description: "Языковая платформа для изучения языков",
	start_url: "/ru",
	display: "standalone",
	background_color: "#121210",
	theme_color: "#121210",
	scope: "/",
	id: "/",
	icons: [
		{
			src: "/icons/icon-192x192.png",
			sizes: "192x192",
			type: "image/png",
			purpose: "any",
		},
		{
			src: "/icons/icon-512x512.png",
			sizes: "512x512",
			type: "image/png",
			purpose: "any",
		},
		{
			src: "/icons/icon-maskable-192x192.png",
			sizes: "192x192",
			type: "image/png",
			purpose: "maskable",
		},
		{
			src: "/icons/icon-maskable-512x512.png",
			sizes: "512x512",
			type: "image/png",
			purpose: "maskable",
		},
	],
	categories: ["education", "productivity"],
	lang: "ru",
	dir: "ltr",
});

export default manifest;
