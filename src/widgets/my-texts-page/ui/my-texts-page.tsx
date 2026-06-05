"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus, Send } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import { UserTextListSkeleton } from "./user-text-list";
import { MyTextsTabs } from "./my-texts-tabs";

interface MyTextsPageProps {
  lang: string;
}

export const MyTextsPage = ({ lang }: MyTextsPageProps) => {
  const { t } = useI18n();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-bd-1 bg-surf px-[22px] py-3 max-sm:px-4">
        <h1 className="text-[13.5px] font-semibold text-t-1">
          {t("myTexts.title")}
        </h1>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="h-8">
            <Link href={`/${lang}/my-texts/submit/new`}>
              <Send className="mr-1.5 size-3.5" aria-hidden="true" />
              {t("myTexts.submit.new")}
            </Link>
          </Button>
          <Button asChild className="h-8">
            <Link href={`/${lang}/my-texts/new`}>
              <Plus className="mr-1.5 size-3.5" aria-hidden="true" />
              {t("myTexts.create")}
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Suspense fallback={<UserTextListSkeleton />}>
          <MyTextsTabs lang={lang} />
        </Suspense>
      </main>
    </div>
  );
};
