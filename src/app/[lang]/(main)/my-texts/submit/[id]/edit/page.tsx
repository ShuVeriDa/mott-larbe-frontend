import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALES, getDictionary } from "@/i18n/locales";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";
import { SITE_URL } from "@/shared/lib/seo";
import { SubmissionEditPageClient } from "@/widgets/user-text-edit/ui/submission-edit-page-client";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> => {
	const { lang, id } = await props.params;
	if (!guardLocaleMetadata(lang)) return {};

	const dict = await getDictionary(lang);
	const meta = dict.myTexts.meta;
	const path = `/my-texts/submit/${id}/edit`;

	const languages: Record<string, string> = {};
	for (const locale of LOCALES) {
		languages[locale] = `${SITE_URL}/${locale}${path}`;
	}
	languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${path}`;

	return {
		title: meta.submitEditTitle,
		description: meta.description,
		alternates: { canonical: `${SITE_URL}/${lang}${path}`, languages },
		openGraph: {
			type: "website",
			url: `${SITE_URL}/${lang}${path}`,
			title: meta.submitEditTitle,
			description: meta.description,
			locale: lang,
			siteName: "Mott Larbe",
		},
		twitter: { card: "summary", title: meta.submitEditTitle, description: meta.description },
		robots: { index: false, follow: false },
	};
};

interface PageProps {
	params: Promise<{ lang: string; id: string }>;
}

// Note: submission drafts are loaded client-side via useOwnedTextSubmission (owner-scoped).
// No server-side prefetch here — the endpoint requires auth cookie which is not available
// in RSC without HydrationBoundary setup. The loading.tsx handles the skeleton.
const MyTextsSubmitEditPage = async ({ params }: PageProps) => {
	const { lang, id } = await params;
	requireLocale(lang);

	return <SubmissionEditPageClient draftId={id} lang={lang} />;
};

export default MyTextsSubmitEditPage;
