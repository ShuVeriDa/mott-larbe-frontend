import { ReactNode, Suspense } from 'react';
import { getDictionary } from "@/i18n/locales";
import { I18nProvider, requireLocale } from "@/shared/lib/i18n";

interface LandingLayoutShellProps {
	children: ReactNode;
	params: Promise<{ lang: string }>;
}

// Resolving `params`/the dictionary here (instead of at the top of LandingLayout)
// keeps that dynamic work inside a <Suspense> boundary — otherwise it blocks
// the entire route's static shell from prerendering under Cache Components.
const LandingLayoutShell = async ({ children, params }: LandingLayoutShellProps) => {
	const { lang } = await params;
	requireLocale(lang);

	const dict = await getDictionary(lang);

	return (
		<I18nProvider lang={lang} dict={dict}>
			{children}
		</I18nProvider>
	);
};

const LandingLayout = ({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ lang: string }>;
}) => (
	<Suspense fallback={null}>
		<LandingLayoutShell params={params}>{children}</LandingLayoutShell>
	</Suspense>
);

export default LandingLayout;
