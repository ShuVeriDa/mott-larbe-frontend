import {
	DEFAULT_LOCALE,
	LOCALES,
	getDictionary,
	hasLocale,
} from "@/i18n/locales";
import { SubmissionPreviewPage } from "@/widgets/submission-preview-page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mottlarbe.com";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!hasLocale(lang)) return {};

	const path = `/admin/text-submissions`;
	const title = "Preview submission — Admin | Mott Larbe";
	const description = "Read submission content before approving or rejecting";

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${path}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

	return {
		title,
		description,
		alternates: {
			canonical: `${SITE_URL}/${lang}${path}`,
			languages,
		},
		openGraph: {
			type: "website",
			url: `${SITE_URL}/${lang}${path}`,
			title,
			description,
			locale: lang,
			siteName: "Mott Larbe",
		},
		robots: { index: false, follow: false },
	};
};

interface SubmissionPreviewRoutePageProps {
	params: Promise<{ lang: string; id: string }>;
	searchParams: Promise<{ page?: string }>;
}

const SubmissionPreviewRoutePage = async ({
	params,
	searchParams,
}: SubmissionPreviewRoutePageProps) => {
	const { lang, id } = await params;
	if (!hasLocale(lang)) notFound();

	const { page } = await searchParams;
	const pageNumber = Math.max(1, parseInt(page ?? "1", 10) || 1);

	return <SubmissionPreviewPage submissionId={id} lang={lang} pageNumber={pageNumber} />;
};

export default SubmissionPreviewRoutePage;
