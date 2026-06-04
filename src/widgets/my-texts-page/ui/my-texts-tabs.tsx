"use client";

import { TabBar, TabItem } from "@/shared/ui/tabs";
import { Tabs, TabContent } from "@/shared/ui/tabs/tabs";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { useSearchParams, useRouter } from "next/navigation";
import { UserTextListSkeleton } from "./user-text-list";
import { MyTextsTabsContent } from "./my-texts-tabs-content";
import { useI18n } from "@/shared/lib/i18n";

export type MyTextsTab = "all" | "original" | "external";

interface MyTextsTabsProps {
  lang: string;
}

const TABS: { value: MyTextsTab; labelKey: string }[] = [
  { value: "all", labelKey: "myTexts.tabs.all" },
  { value: "original", labelKey: "myTexts.tabs.myWorks" },
  { value: "external", labelKey: "myTexts.tabs.external" },
];

// MyTextsTabs owns only tab navigation state.
// useSuspenseQuery lives in MyTextsTabsContent — wrapped in Suspense+ErrorBoundary.
export const MyTextsTabs = ({ lang }: MyTextsTabsProps) => {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = (searchParams.get("tab") ?? "all") as MyTextsTab;
  const activeTab: MyTextsTab = ["all", "original", "external"].includes(tabParam)
    ? tabParam
    : "all";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      {/* Tab bar */}
      <div className="flex items-center gap-3 border-b border-bd-1 px-4 py-2">
        <TabBar>
          {TABS.map((tab) => (
            <TabItem
              key={tab.value}
              value={tab.value}
              aria-label={t(tab.labelKey)}
            >
              {t(tab.labelKey)}
            </TabItem>
          ))}
        </TabBar>
      </div>

      {/* Tab panels — MyTextsTabsContent handles its own loading/error states */}
      {TABS.map((tab) => (
        <TabContent key={tab.value} value={tab.value}>
          <ErrorBoundary fallback={<UserTextListSkeleton />}>
            <MyTextsTabsContent
              activeTab={activeTab}
              lang={lang}
              t={t}
            />
          </ErrorBoundary>
        </TabContent>
      ))}
    </Tabs>
  );
};
