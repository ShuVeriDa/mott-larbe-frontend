import { useUserMenu } from "../model";
import { UserMenuAdminSection } from "./user-menu-admin-section";
import { UserMenuLanguageSection } from "./user-menu-language-section";
import { UserMenuLogoutSection } from "./user-menu-logout-section";
import { UserMenuNavSection } from "./user-menu-nav-section";
import { UserMenuSupportSection } from "./user-menu-support-section";
import { UserMenuThemeSection } from "./user-menu-theme-section";

interface UserMenuContentProps {
	showThemeToggle?: boolean;
}

export const UserMenuContent = ({
	showThemeToggle = false,
}: UserMenuContentProps) => {
	const {
		t,
		lang,
		logout,
		showAdmin,
		theme,
		handleThemeItemSelect,
		handleSetTheme,
		handleLogout,
		handleLanguageItemSelect,
		handleLocaleClick,
		localeShort,
		locales,
	} = useUserMenu();

	return (
		<>
			<UserMenuNavSection lang={lang} t={t} />
			<UserMenuSupportSection lang={lang} t={t} />
			{showAdmin && <UserMenuAdminSection lang={lang} t={t} />}
			<UserMenuLanguageSection
				lang={lang}
				t={t}
				locales={locales}
				localeShort={localeShort}
				onLanguageItemSelect={handleLanguageItemSelect}
				onLocaleClick={handleLocaleClick}
			/>
			{showThemeToggle && (
				<UserMenuThemeSection
					t={t}
					theme={theme}
					onThemeItemSelect={handleThemeItemSelect}
					onSetTheme={handleSetTheme}
				/>
			)}
			<UserMenuLogoutSection
				t={t}
				isPending={logout.isPending}
				onLogout={handleLogout}
			/>
		</>
	);
};
