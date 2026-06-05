import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, getDictionary, hasLocale } from "@/i18n/locales";
import { buildAlternates, buildOpenGraph } from "@/shared/lib/seo";
import { MyTextsPage } from "@/widgets/my-texts-page";

export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

interface PageProps {
	params: Promise<{ lang: string }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const dict = await getDictionary(lang);
	const { title, description } = dict.myTexts.meta;
	const path = "/my-texts";
	const { canonical, languages } = buildAlternates(lang, path);

	return {
		title,
		description,
		alternates: { canonical, languages },
		openGraph: buildOpenGraph(lang, path, title, description),
		twitter: { card: "summary_large_image", title, description },
		robots: { index: false, follow: false },
	};
};

const MyTextsRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	return <MyTextsPage lang={lang} />;
};

export default MyTextsRoutePage;
