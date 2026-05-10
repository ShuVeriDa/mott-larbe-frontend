import { ComponentProps } from 'react';
import type { AdminDictLanguage, AdminDictSort } from "@/entities/dictionary";
import type { CefrLevel } from "@/shared/types";
import { CEFR_LEVELS } from "@/shared/types";
import { Search } from "lucide-react";
import { Select } from "@/shared/ui/select";

const POS_OPTIONS = [
	"noun",
	"verb",
	"adj",
	"adv",
	"particle",
	"pron",
	"num",
	"conj",
];
const SORT_OPTIONS: { value: AdminDictSort; key: string }[] = [
	{ value: "alpha", key: "admin.dictionary.toolbar.sortAlpha" },
	{
		value: "frequency_desc",
		key: "admin.dictionary.toolbar.sortFrequencyDesc",
	},
	{ value: "newest", key: "admin.dictionary.toolbar.sortNewest" },
	{ value: "oldest", key: "admin.dictionary.toolbar.sortOldest" },
	{ value: "no_senses", key: "admin.dictionary.toolbar.sortNoSenses" },
];
const LANG_OPTIONS: AdminDictLanguage[] = ["CHE", "RU"];

interface DictionaryToolbarProps {
	search: string;
	pos: string;
	level: string;
	sort: AdminDictSort;
	language: string;
	onSearchChange: (v: string) => void;
	onPosChange: (v: string) => void;
	onLevelChange: (v: string) => void;
	onSortChange: (v: AdminDictSort) => void;
	onLanguageChange: (v: string) => void;
	t: (key: string) => string;
}

export const DictionaryToolbar = ({
	search,
	pos,
	level,
	sort,
	language,
	onSearchChange,
	onPosChange,
	onLevelChange,
	onSortChange,
	onLanguageChange,
	t,
}: DictionaryToolbarProps) => {
	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => onSearchChange(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = e => onLanguageChange(e.currentTarget.value);
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = e => onPosChange(e.currentTarget.value);
	const handleChange4: NonNullable<ComponentProps<"select">["onChange"]> = e => onLevelChange(e.currentTarget.value);
	const handleChange5: NonNullable<ComponentProps<"select">["onChange"]> = e => onSortChange(e.currentTarget.value as AdminDictSort);
	return (
		<div className="mb-3.5 flex flex-wrap items-center gap-2">
			<div className="relative min-w-[200px] flex-1 max-w-[320px]">
				<Search className="pointer-events-none absolute left-2.5 top-1/2 size-[13px] -translate-y-1/2 text-t-3" />
				<input
					type="text"
					value={search}
					onChange={handleChange}
					placeholder={t("admin.dictionary.toolbar.searchPlaceholder")}
					className="h-[30px] w-full rounded-base border border-bd-2 bg-surf pl-[30px] pr-2.5 text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
				/>
			</div>

			<Select value={language} onChange={handleChange2} wrapperClassName="w-auto" className="bg-surf text-t-2 hover:border-bd-3">
				<option value="">{t("admin.dictionary.toolbar.allLanguages")}</option>
				{LANG_OPTIONS.map(l => (
					<option key={l} value={l}>
						{t(`admin.dictionary.toolbar.lang${l}`)}
					</option>
				))}
			</Select>

			<Select value={pos} onChange={handleChange3} wrapperClassName="w-auto" className="bg-surf text-t-2 hover:border-bd-3">
				<option value="">{t("admin.dictionary.toolbar.allPos")}</option>
				{POS_OPTIONS.map(p => (
					<option key={p} value={p}>
						{t(`admin.dictionary.pos.${p}`)}
					</option>
				))}
			</Select>

			<Select value={level} onChange={handleChange4} wrapperClassName="w-auto" className="bg-surf text-t-2 hover:border-bd-3">
				<option value="">{t("admin.dictionary.toolbar.allLevels")}</option>
				{CEFR_LEVELS.map((lvl: CefrLevel) => (
					<option key={lvl} value={lvl}>
						{lvl}
					</option>
				))}
			</Select>

			<Select value={sort} onChange={handleChange5} wrapperClassName="w-auto" className="bg-surf text-t-2 hover:border-bd-3">
				{SORT_OPTIONS.map(({ value, key }) => (
					<option key={value} value={value}>
						{t(key)}
					</option>
				))}
			</Select>
		</div>
	);
};
