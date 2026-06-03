"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";
import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type { MyTextsTab } from "./my-texts-tabs";

interface MyTextsEmptyStateProps {
  tab: MyTextsTab;
  lang: string;
  t: (key: string) => string;
}

// Different CTA per tab — improves conversion vs generic empty state
export const MyTextsEmptyState = ({ tab, lang, t }: MyTextsEmptyStateProps) => {
  const config: Record<MyTextsTab, { text: string; cta: string; href: string }> = {
    all: {
      text: t("myTexts.emptyAll"),
      cta: t("myTexts.createFirst"),
      href: `/${lang}/my-texts/new`,
    },
    original: {
      text: t("myTexts.emptyOriginal"),
      cta: t("myTexts.createOriginal"),
      href: `/${lang}/my-texts/new`,
    },
    external: {
      text: t("myTexts.emptyExternal"),
      cta: t("myTexts.createExternal"),
      href: `/${lang}/my-texts/new`,
    },
  };

  const { text, cta, href } = config[tab];

  return (
    <div className="flex flex-col items-center px-4 py-12 text-center">
      <Inbox className="mb-3 size-8 text-t-4" aria-hidden="true" />
      <Typography tag="p" className="mb-3 text-[12.5px] text-t-3">
        {text}
      </Typography>
      <Button asChild variant="outline">
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  );
};
