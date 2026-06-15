"use client";

import type { TranslationLanguage } from "@/entities/ai-translation";
import { SUPPORTED_TRANSLATION_LANGUAGES } from "@/entities/ai-translation";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { useTranslationLanguageStore } from "../model/translation-language-store";

const LANGUAGE_LABELS: Record<TranslationLanguage, string> = {
  ru: "RU",
  en: "EN",
  ar: "AR",
  de: "DE",
  fr: "FR",
  tr: "TR",
};

interface LanguageSelectorProps {
  size?: "sm" | "xs";
  className?: string;
}

export const LanguageSelector = ({ size = "sm", className }: LanguageSelectorProps) => {
  const { targetLanguage, setTargetLanguage } = useTranslationLanguageStore();

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {SUPPORTED_TRANSLATION_LANGUAGES.map((lang: TranslationLanguage) => {
        const isActive = lang === targetLanguage;
        const handleClick = () => setTargetLanguage(lang);
        return (
          <Button
            key={lang}
            size="bare"
            onClick={handleClick}
            aria-pressed={isActive}
            className={cn(
              "rounded px-1.5 font-mono font-semibold tracking-wide transition-colors",
              size === "xs"
                ? "h-5 text-[9px]"
                : "h-6 text-[10px]",
              isActive
                ? "bg-acc text-white"
                : "text-t-3 hover:bg-surf-2 hover:text-t-1",
            )}
          >
            {LANGUAGE_LABELS[lang]}
          </Button>
        );
      })}
    </div>
  );
};
