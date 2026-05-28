import type { TranslationLanguage } from "@/entities/ai-translation";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";

const LANGUAGE_LABELS: Record<TranslationLanguage, string> = {
	ru: "Русский",
	en: "English",
	ar: "العربية",
	de: "Deutsch",
	fr: "Français",
	tr: "Türkçe",
};

interface LanguageButtonProps {
	lang: TranslationLanguage;
	isActive: boolean;
	onSelect: (lang: TranslationLanguage) => void;
}

export const LanguageButton = ({ lang, isActive, onSelect }: LanguageButtonProps) => {
	const handleClick = () => onSelect(lang);

	return (
		<Button
			size="bare"
			onClick={handleClick}
			aria-pressed={isActive}
			className={cn(
				"h-8 rounded-base border px-3 text-[12px] font-medium transition-colors",
				isActive
					? "border-acc/40 bg-acc/10 text-acc"
					: "border-bd-2 bg-surf-2 text-t-2 hover:bg-surf-3 hover:text-t-1",
			)}
		>
			{LANGUAGE_LABELS[lang]}
		</Button>
	);
};
