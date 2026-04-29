import { LOCALES } from "@/i18n/locales";

export const generateStaticParams = async () =>
	LOCALES.map((lang) => ({ lang }));

const LangLayout = ({ children }: { children: React.ReactNode }) => (
	<>{children}</>
);

export default LangLayout;
