import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/*/dashboard",
					"/*/admin",
					"/*/reader",
					"/*/review",
					"/*/profile",
					"/*/settings",
					"/*/progress",
					"/*/subscription",
					"/*/my-texts",
					"/*/vocabulary",
					"/*/texts",
					"/*/phrasebook",
					"/*/feedback",
					"/api/",
					"/_next/",
				],
			},
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}
