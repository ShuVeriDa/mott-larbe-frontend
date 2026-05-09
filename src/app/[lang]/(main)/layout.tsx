import { ReactNode } from 'react';
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/i18n/locales";
import { I18nProvider } from "@/shared/lib/i18n";
import { AppShell } from "@/widgets/app-shell";

const MainLayout = async ({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ lang: string }>;
}) => {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const dict = await getDictionary(lang);

	return (
		<I18nProvider lang={lang} dict={dict}>
			<AppShell>{children}</AppShell>
		</I18nProvider>
	);
};

export default MainLayout;
