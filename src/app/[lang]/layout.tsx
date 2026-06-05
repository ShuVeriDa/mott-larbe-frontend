import { ReactNode } from 'react';
import { LOCALES } from "@/i18n/locales";

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

interface LangLayoutProps {
	children: ReactNode;
	params: Promise<{ lang: string }>;
}

const LangLayout = async ({ children }: LangLayoutProps) => (
	<>{children}</>
);

export default LangLayout;
