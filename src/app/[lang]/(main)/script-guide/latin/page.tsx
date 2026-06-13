import { redirect } from "next/navigation";
import { LOCALES } from "@/i18n/locales";

export const generateStaticParams = async () => LOCALES.map(lang => ({ lang }));

interface PageProps {
	params: Promise<{ lang: string }>;
}

const LatinGuideRedirect = async ({ params }: PageProps) => {
	const { lang } = await params;
	redirect(`/${lang}/script-guide?tab=latin`);
};

export default LatinGuideRedirect;
