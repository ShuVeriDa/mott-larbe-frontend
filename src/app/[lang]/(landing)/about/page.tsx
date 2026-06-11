import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, getDictionary, hasLocale } from "@/i18n/locales";
import { buildAlternates, buildOpenGraph, SITE_URL } from "@/shared/lib/seo";
import { DeveloperPage } from "@/widgets/developer-page";

export const generateStaticParams = async () => LOCALES.map((lang) => ({ lang }));

interface PageProps {
	params: Promise<{ lang: string }>;
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!hasLocale(lang)) return {};

	const dict = await getDictionary(lang);
	const aboutPage = (dict as unknown as { landing?: { aboutPage?: { meta?: { title?: string; description?: string } } } }).landing?.aboutPage;
	const title = aboutPage?.meta?.title ?? "About the developer — Mott Larbe";
	const description = aboutPage?.meta?.description ?? "";
	const { canonical, languages } = buildAlternates(lang, "/about");

	return {
		title,
		description,
		alternates: { canonical, languages },
		openGraph: buildOpenGraph(lang, "/about", title, description),
		robots: { index: true, follow: true },
	};
};

const AboutPage = async ({ params }: PageProps) => {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const url = `${SITE_URL}/${lang}/about`;
	const personJsonLd = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Sayd-Makhamed (ShuVeriDa)",
		url,
		sameAs: ["https://t.me/shuverida"],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
			/>
			<DeveloperPage />
		</>
	);
};

export default AboutPage;
