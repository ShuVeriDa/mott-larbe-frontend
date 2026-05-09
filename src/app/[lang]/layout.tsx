import { ReactNode } from 'react';
import { LOCALES } from "@/i18n/locales";

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

const LangLayout = ({ children }: { children: ReactNode }) => (
	<>{children}</>
);

export default LangLayout;
