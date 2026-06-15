import type { Metadata } from "next";
import { getDictionary } from "@/i18n/locales";
import { guardLocaleMetadata, requireLocale } from "@/shared/lib/i18n";
import { buildAlternates, buildOpenGraph, SITE_URL } from "@/shared/lib/seo";
import { ProfilePage, ProfilePageSkeleton } from "@/widgets/profile-page";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { Suspense } from "react";

const PATH = "/profile";

export const generateMetadata = async (props: {
	params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
	const { lang } = await props.params;
	if (!guardLocaleMetadata(lang)) return {};

	const dict = await getDictionary(lang);
	const { title, description } = dict.profile.meta;
	const { canonical, languages } = buildAlternates(lang, PATH);

	return {
		title,
		description,
		alternates: { canonical, languages },
		openGraph: buildOpenGraph(lang, PATH, title, description),
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [`${SITE_URL}/opengraph-image.png`],
		},
		robots: {
			index: false,
			follow: false,
		},
	};
};

interface PageProps {
	params: Promise<{ lang: string }>;
}

const ProfileRoutePage = async ({ params }: PageProps) => {
	const { lang } = await params;
	requireLocale(lang);

	return (
		<ErrorBoundary fallback={<ProfilePageSkeleton />}>
			<Suspense fallback={<ProfilePageSkeleton />}>
				<ProfilePage lang={lang} />
			</Suspense>
		</ErrorBoundary>
	);
};

export default ProfileRoutePage;
