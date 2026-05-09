import type { AdminDictLanguage, AdminDictSort } from "@/entities/dictionary";
import type { CefrLevel } from "@/shared/types";
import { CEFR_LEVELS } from "@/shared/types";

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
	const selectCls =
		"h-[30px] cursor-pointer rounded-base border border-bd-2 bg-surf px-2 text-[12.5px] text-t-2 outline-none transition-colors hover:border-bd-3";

		const handleChange: NonNullable<React.ComponentProps<"input">["onChange"]> = e => onSearchChange(e.target.value);
	const handleChange2: NonNullable<React.ComponentProps<"select">["onChange"]> = e => onLanguageChange(e.target.value);
	const handleChange3: NonNullable<React.ComponentProps<"select">["onChange"]> = e => onPosChange(e.target.value);
	const handleChange4: NonNullable<React.ComponentProps<"select">["onChange"]> = e => onLevelChange(e.target.value);
	const handleChange5: NonNullable<React.ComponentProps<"select">["onChange"]> = e => onSortChange(e.target.value as AdminDictSort);
return (
		<div className="mb-3.5 flex flex-wrap items-center gap-2">
			<div className="relative min-w-[200px] flex-1 max-w-[320px]">
				<svg
					className="pointer-events-none absolute left-2.5 top-1/2 size-[13px] -translate-y-1/2 text-t-3"
					viewBox="0 0 15 15"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.4"
				>
					<circle cx="6.5" cy="6.5" r="4" />
					<path d="M10 10l2.5 2.5" strokeLinecap="round" />
				</svg>
				<input
					type="text"
					value={search}
					onChange={handleChange}
					placeholder={t("admin.dictionary.toolbar.searchPlaceholder")}
					className="h-[30px] w-full rounded-base border border-bd-2 bg-surf pl-[30px] pr-2.5 text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
				/>
			</div>

			<select
				value={language}
				onChange={handleChange2}
				className={selectCls}
			>
				<option value="">{t("admin.dictionary.toolbar.allLanguages")}</option>
				{LANG_OPTIONS.map(l => (
					<option key={l} value={l}>
						{t(`admin.dictionary.toolbar.lang${l}`)}
					</option>
				))}
			</select>

			<select
				value={pos}
				onChange={handleChange3}
				className={selectCls}
			>
				<option value="">{t("admin.dictionary.toolbar.allPos")}</option>
				{POS_OPTIONS.map(p => (
					<option key={p} value={p}>
						{t(`admin.dictionary.pos.${p}`)}
					</option>
				))}
			</select>

			<select
				value={level}
				onChange={handleChange4}
				className={selectCls}
			>
				<option value="">{t("admin.dictionary.toolbar.allLevels")}</option>
				{CEFR_LEVELS.map((lvl: CefrLevel) => (
					<option key={lvl} value={lvl}>
						{lvl}
					</option>
				))}
			</select>

			<select
				value={sort}
				onChange={handleChange5}
				className={selectCls}
			>
				{SORT_OPTIONS.map(({ value, key }) => (
					<option key={value} value={value}>
						{t(key)}
					</option>
				))}
			</select>
		</div>
	);
};
