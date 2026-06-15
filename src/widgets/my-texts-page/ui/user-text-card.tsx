"use client";

import Link from "next/link";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type { UserTextListItem, UserTextType } from "@/entities/user-text";

// Status bar color matching design system (plan: Design system section)
const typeBarClass: Record<UserTextType, string> = {
  ORIGINAL: "bg-acc",
  EXTERNAL: "bg-surf-3",
};

interface UserTextCardProps {
  item: UserTextListItem;
  lang: string;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

export const UserTextCard = ({ item, lang, onDelete, t }: UserTextCardProps) => {
  // Named handler inside map — per plan feedback-event-handlers-in-map rule
  const handleDelete = () => onDelete(item.id);

  return (
    <article className="flex overflow-hidden rounded-xl border border-bd-1 bg-surf">
      {/* Left type bar */}
      <div className={cn("w-1 shrink-0", typeBarClass[item.type])} />

      <div className="flex min-w-0 flex-1 flex-col gap-2 px-4 py-3.5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/${lang}/my-texts/${item.id}/p/1`}
              className="line-clamp-2 text-[13px] font-medium text-t-1 font-display hover:text-acc"
            >
              {item.title}
            </Link>
            <Typography tag="p" className="mt-0.5 text-[11.5px] text-t-3">
              {item.language}
              {item.author && ` · ${item.author}`}
              {" · "}
              {new Date(item.updatedAt).toLocaleDateString()}
            </Typography>
          </div>

          {/* Type badge */}
          <Typography
            tag="span"
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
              item.type === "ORIGINAL"
                ? "bg-acc/10 text-acc"
                : "bg-surf-2 text-t-3",
            )}
          >
            {t(`myTexts.type.${item.type.toLowerCase()}`)}
          </Typography>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="h-7 px-2 text-[12px] text-t-3 hover:text-t-1">
            <Link href={`/${lang}/my-texts/${item.id}/p/1`}>
              <BookOpen className="mr-1 size-3.5" aria-hidden="true" />
              {t("myTexts.read")}
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-7 px-2 text-[12px] text-t-3 hover:text-t-1">
            <Link href={`/${lang}/my-texts/${item.id}/edit`}>
              <Pencil className="mr-1 size-3.5" aria-hidden="true" />
              {t("myTexts.edit")}
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-7 px-2 text-[12px] text-t-3 hover:text-red-500"
            onClick={handleDelete}
            aria-label={t("myTexts.deleteAriaLabel")}
          >
            <Trash2 className="mr-1 size-3.5" aria-hidden="true" />
            {t("myTexts.delete")}
          </Button>
        </div>
      </div>
    </article>
  );
};
