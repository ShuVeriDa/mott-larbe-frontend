import { ReactNode, Suspense } from 'react';
import { getDictionary } from "@/i18n/locales";
import { I18nProvider, requireLocale } from "@/shared/lib/i18n";
import { AdminShell } from "@/widgets/admin-shell";

interface AdminLayoutShellProps {
	children: ReactNode;
	params: Promise<{ lang: string }>;
}

// Resolving `params`/the dictionary here (instead of at the top of AdminLayout)
// keeps that dynamic work inside a <Suspense> boundary — otherwise it blocks
// the entire route's static shell from prerendering under Cache Components.
const AdminLayoutShell = async ({ children, params }: AdminLayoutShellProps) => {
	const { lang } = await params;
	requireLocale(lang);

	const dict = await getDictionary(lang);

	return (
		<I18nProvider lang={lang} dict={dict}>
			<AdminShell>{children}</AdminShell>
		</I18nProvider>
	);
};

const AdminLayout = ({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ lang: string }>;
}) => (
	<Suspense fallback={null}>
		<AdminLayoutShell params={params}>{children}</AdminLayoutShell>
	</Suspense>
);

export default AdminLayout;
