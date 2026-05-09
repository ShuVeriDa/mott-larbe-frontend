"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { MorphRuleType } from "@/entities/morph-rule";

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

    const handleChange: NonNullable<React.ComponentProps<"input">["onChange"]> = (e) => onSearchChange(e.target.value);
  const handleChange2: NonNullable<React.ComponentProps<"select">["onChange"]> = (e) => onPosChange(e.target.value);
  const handleChange3: NonNullable<React.ComponentProps<"select">["onChange"]> = (e) => onTypeChange(e.target.value as MorphRuleType | "");
return (
    <div className="mb-3.5 flex flex-wrap items-center gap-2">
      <div className="relative min-w-[160px] flex-1">
        <svg
          className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-t-3"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M10 10l3 3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={handleChange}
          placeholder={t("admin.morphology.toolbar.searchPlaceholder")}
          className="h-8 w-full rounded-lg border border-bd-2 bg-surf pl-8 pr-2.5 text-[12.5px] text-t-1 placeholder:text-t-3 focus:border-acc focus:outline-none"
        />
      </div>

      <select
        value={pos}
        onChange={handleChange2}
        className="h-8 appearance-none rounded-lg border border-bd-2 bg-surf bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2211%22%20height%3D%2211%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M4%206l4%204%204-4%22%20stroke%3D%22%23a5a39a%22%20stroke-width%3D%221.4%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[right_8px_center] bg-no-repeat pl-2.5 pr-7 text-[12.5px] text-t-2 focus:border-acc focus:outline-none"
      >
        <option value="">{t("admin.morphology.toolbar.allPos")}</option>
        {POS_OPTIONS.map((p) => (
          <option key={p} value={p}>
            {t(`admin.morphology.pos.${p.toLowerCase()}` as never) || p}
          </option>
        ))}
      </select>

      <select
        value={type}
        onChange={handleChange3}
        className="h-8 appearance-none rounded-lg border border-bd-2 bg-surf bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2211%22%20height%3D%2211%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M4%206l4%204%204-4%22%20stroke%3D%22%23a5a39a%22%20stroke-width%3D%221.4%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[right_8px_center] bg-no-repeat pl-2.5 pr-7 text-[12.5px] text-t-2 focus:border-acc focus:outline-none"
      >
        <option value="">{t("admin.morphology.toolbar.allTypes")}</option>
        {TYPE_OPTIONS.map((tp) => (
          <option key={tp} value={tp}>
            {t(`admin.morphology.ruleType.${tp}` as never) || tp}
          </option>
        ))}
      </select>
    </div>
  );
};
