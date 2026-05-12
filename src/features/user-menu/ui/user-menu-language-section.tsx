import type { Locale } from "@/i18n/locale-list";
import { cn } from "@/shared/lib/cn";
import type { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { GlobeIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { UserMenuInlineRow } from "./user-menu-inline-row";

interface UserMenuLanguageSectionProps {
	lang: string;
	t: ReturnType<typeof useI18n>["t"];
	locales: readonly Locale[];
	localeShort: Record<Locale, string>;
	onLanguageItemSelect: (e: Event) => void;
	onLocaleClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const UserMenuLanguageSection = ({
	lang,
	t,
	locales,
	localeShort,
	onLanguageItemSelect,
	onLocaleClick,
}: UserMenuLanguageSectionProps) => (
	<UserMenuInlineRow
		icon={<GlobeIcon className="size-[13px] shrink-0 text-t-3" strokeWidth={1.75} />}
		label={t("nav.userMenu.language")}
		onItemSelect={onLanguageItemSelect}
	>
		{locales.map(locale => {
			const active = locale === lang;
			return (
				<Button
					key={locale}
					data-locale={locale}
					role="radio"
					aria-checked={active}
					onClick={onLocaleClick}
					className={cn(
						"px-2 py-0.5 min-w-[28px] text-[10.5px] font-medium rounded-full transition-colors",
						active ? "bg-acc text-white" : "text-t-3 hover:text-t-1",
					)}
				>
					{localeShort[locale]}
				</Button>
			);
		})}
	</UserMenuInlineRow>
);
