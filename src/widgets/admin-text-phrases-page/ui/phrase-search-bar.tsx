"use client";

import { ComponentProps } from "react";
import { SearchBox } from "@/shared/ui/search-box";
import { Select } from "@/shared/ui/select";
import type { TextPhraseLanguage } from "@/entities/text-phrase";

const LANGUAGES: { value: TextPhraseLanguage | ""; label: string }[] = [
	{ value: "", label: "Все" },
	{ value: "CHE", label: "CHE" },
	{ value: "RU", label: "RUS" },
	{ value: "EN", label: "EN" },
];

interface PhraseSearchBarProps {
	search: string;
	language: TextPhraseLanguage | "";
	onSearchChange: (v: string) => void;
	onLanguageChange: (v: string) => void;
	t: (key: string) => string;
}

export const PhraseSearchBar = ({
	search,
	language,
	onSearchChange,
	onLanguageChange,
	t,
}: PhraseSearchBarProps) => {
	const handleSearchChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) =>
		onSearchChange(e.currentTarget.value);
	const handleLanguageChange: NonNullable<ComponentProps<"select">["onChange"]> = (e) =>
		onLanguageChange(e.currentTarget.value);

	return (
		<div className="flex shrink-0 gap-2 border-b border-bd-1 p-3">
			<SearchBox
				variant="toolbar"
				wrapperClassName="flex-1 h-[30px]"
				placeholder={t("admin.textPhrases.searchPlaceholder")}
				value={search}
				onChange={handleSearchChange}
			/>
			<Select
				variant="search-toolbar"
				wrapperClassName="w-[80px] shrink-0"
				value={language}
				onChange={handleLanguageChange}
			>
				{LANGUAGES.map((l) => (
					<option key={l.value} value={l.value}>
						{l.label}
					</option>
				))}
			</Select>
		</div>
	);
};
