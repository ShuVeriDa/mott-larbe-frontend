import { ReactNode } from 'react';
import { getDictionary } from "@/i18n/locales";
import { I18nProvider, requireLocale } from "@/shared/lib/i18n";
import { AdminShell } from "@/widgets/admin-shell";

const AdminLayout = async ({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ lang: string }>;
}) => {
	const { lang } = await params;
	requireLocale(lang);

	const dict = await getDictionary(lang);

	return (
		<I18nProvider lang={lang} dict={dict}>
			<AdminShell>{children}</AdminShell>
		</I18nProvider>
	);
};

export default AdminLayout;
