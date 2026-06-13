import { redirect } from "next/navigation";
import { LOCALES } from "@/i18n/locales";

export const generateStaticParams = async () => LOCALES.map(lang => ({ lang }));

interface PageProps {
	params: Promise<{ lang: string }>;
}

const ArabicGuideRedirect = async ({ params }: PageProps) => {
	const { lang } = await params;
	redirect(`/${lang}/script-guide?tab=arabic`);
};

export default ArabicGuideRedirect;
