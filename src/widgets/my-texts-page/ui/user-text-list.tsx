"use client";

import { Typography } from "@/shared/ui/typography";
import { UserTextCard } from "./user-text-card";
import { MyTextsEmptyState } from "./my-texts-empty-state";
import type { UserTextListItem } from "@/entities/user-text";
import type { MyTextsTab } from "./my-texts-tabs";

interface UserTextListProps {
  items: UserTextListItem[];
  tab: MyTextsTab;
  lang: string;
  total: number;
  isDeleting: boolean;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

export const UserTextList = ({
  items,
  tab,
  lang,
  total,
  isDeleting,
  onDelete,
  t,
}: UserTextListProps) => {
  if (items.length === 0) {
    return <MyTextsEmptyState tab={tab} lang={lang} t={t} />;
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* TODO: add @tanstack/react-virtual here when list grows beyond 50 items */}
      {items.map((item) => {
        // Named handler per item — CLAUDE.md feedback: no anon arrows in .map()
        const handleDelete = () => onDelete(item.id);
        return (
          <UserTextCard
            key={item.id}
            item={item}
            lang={lang}
            onDelete={handleDelete}
            t={t}
          />
        );
      })}

      {total > items.length && (
        <Typography tag="p" className="py-2 text-center text-[12px] text-t-3">
          {t("myTexts.showingOf")
            .replace("{shown}", String(items.length))
            .replace("{total}", String(total))}
        </Typography>
      )}
    </div>
  );
};

