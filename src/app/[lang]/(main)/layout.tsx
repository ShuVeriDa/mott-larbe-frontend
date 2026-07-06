import { ReactNode, Suspense } from 'react';
import { getDictionary } from "@/i18n/locales";
import { I18nProvider, requireLocale } from "@/shared/lib/i18n";
import { AppShell } from "@/widgets/app-shell";
import MainPageLoading from "./loading";

interface MainLayoutShellProps {
	children: ReactNode;
	params: Promise<{ lang: string }>;
}

// Resolving `params`/the dictionary here (instead of at the top of MainLayout)
// keeps that dynamic work inside a <Suspense> boundary — otherwise it blocks
// the entire route's static shell from prerendering under Cache Components.
const MainLayoutShell = async ({ children, params }: MainLayoutShellProps) => {
	const { lang } = await params;
	requireLocale(lang);

	const dict = await getDictionary(lang);

	return (
		<I18nProvider lang={lang} dict={dict}>
			<AppShell>{children}</AppShell>
		</I18nProvider>
	);
};

const MainLayout = ({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ lang: string }>;
}) => (
	<Suspense fallback={<MainPageLoading />}>
		<MainLayoutShell params={params}>{children}</MainLayoutShell>
	</Suspense>
);

export default MainLayout;
