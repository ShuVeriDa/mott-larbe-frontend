"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { MorphRuleType } from "@/entities/morph-rule";
import { SearchBox } from "@/shared/ui/search-box";
import { Select } from "@/shared/ui/select";

const POS_OPTIONS = ["NOUN", "VERB", "ADJ", "ADV", "PRON"];
const TYPE_OPTIONS: MorphRuleType[] = [
  "SUFFIX",
  "ENDING",
  "PREFIX",
  "NOUN_CASE",
  "PLURAL",
  "VERB_PAST",
  "REGEX",
];

interface Props {
  search: string;
  pos: string;
  type: MorphRuleType | "";
  onSearchChange: (v: string) => void;
  onPosChange: (v: string) => void;
  onTypeChange: (v: MorphRuleType | "") => void;
}

export const MorphologyToolbar = ({
  search,
  pos,
  type,
  onSearchChange,
  onPosChange,
  onTypeChange,
}: Props) => {
  const { t } = useI18n();

  const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => onSearchChange(e.currentTarget.value);
  const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onPosChange(e.currentTarget.value);
  const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onTypeChange(e.currentTarget.value as MorphRuleType | "");
  return (
    <div className="mb-3.5 flex flex-wrap items-center gap-2">
      <SearchBox
        value={search}
        onChange={handleChange}
        placeholder={t("admin.morphology.toolbar.searchPlaceholder")}
        wrapperClassName="min-w-[160px] flex-1"
        className="h-8"
      />

      <Select value={pos} onChange={handleChange2} wrapperClassName="w-auto" className="bg-surf text-t-2 rounded-lg h-8 hover:border-bd-3">
        <option value="">{t("admin.morphology.toolbar.allPos")}</option>
        {POS_OPTIONS.map((p) => (
          <option key={p} value={p}>
            {t(`admin.morphology.pos.${p.toLowerCase()}` as never) || p}
          </option>
        ))}
      </Select>

      <Select value={type} onChange={handleChange3} wrapperClassName="w-auto" className="bg-surf text-t-2 rounded-lg h-8 hover:border-bd-3">
        <option value="">{t("admin.morphology.toolbar.allTypes")}</option>
        {TYPE_OPTIONS.map((tp) => (
          <option key={tp} value={tp}>
            {t(`admin.morphology.ruleType.${tp}` as never) || tp}
          </option>
        ))}
      </Select>
    </div>
  );
};
