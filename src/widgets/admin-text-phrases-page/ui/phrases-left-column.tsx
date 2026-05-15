"use client";

import type {
	TextPhraseLanguage,
	TextPhraseListItem,
} from "@/entities/text-phrase";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { BookOpen } from "lucide-react";
import { PhraseListItem, PhraseListItemSkeleton } from "./phrase-list-item";
import { PhraseSearchBar } from "./phrase-search-bar";
import { PhrasesPagination } from "./phrases-pagination";

interface PhrasesLeftColumnProps {
	items: TextPhraseListItem[];
	isLoading: boolean;
	selectedId: string;
	search: string;
	language: TextPhraseLanguage | "";
	page: number;
	totalPages: number;
	total: number;
	limit: number;
	onSearchChange: (v: string) => void;
	onLanguageChange: (v: string) => void;
	onSelectPhrase: (id: string) => void;
	onEditPhrase: (item: TextPhraseListItem) => void;
	onDeletePhrase: (item: TextPhraseListItem) => void;
	onPageChange: (p: number) => void;
	onCreateOpen: () => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const PhrasesLeftColumn = ({
	items,
	isLoading,
	selectedId,
	search,
	language,
	page,
	totalPages,
	total,
	limit,
	onSearchChange,
	onLanguageChange,
	onSelectPhrase,
	onEditPhrase,
	onDeletePhrase,
	onPageChange,
	onCreateOpen,
	t,
}: PhrasesLeftColumnProps) => {
	const isEmpty = !isLoading && items.length === 0;

	return (
		<div className="flex flex-1 flex-col overflow-hidden border-r border-bd-1">
			<PhraseSearchBar
				search={search}
				language={language}
				onSearchChange={onSearchChange}
				onLanguageChange={onLanguageChange}
				t={t}
			/>

			<div className="flex-1 overflow-y-auto">
				{isLoading ? (
					Array.from({ length: 8 }).map((_, i) => (
						<PhraseListItemSkeleton key={i} />
					))
				) : isEmpty ? (
					<div className="flex flex-col items-center px-4 py-12 text-center">
						<BookOpen className="mb-3 size-8 text-t-4" />
						<Typography tag="p" className="mb-3 text-[12.5px] text-t-3">
							{search
								? t("admin.textPhrases.emptySearch")
								: t("admin.textPhrases.empty")}
						</Typography>
						{!search && (
							<Button variant="action" size="default" onClick={onCreateOpen}>
								{t("admin.textPhrases.newPhrase")}
							</Button>
						)}
					</div>
				) : (
					items.map(item => (
						<PhraseListItem
							key={item.id}
							item={item}
							isActive={item.id === selectedId}
							onSelect={onSelectPhrase}
							onEdit={onEditPhrase}
							onDelete={onDeletePhrase}
						/>
					))
				)}
			</div>

			{total > 0 && (
				<PhrasesPagination
					page={page}
					totalPages={totalPages}
					total={total}
					limit={limit}
					onChange={onPageChange}
					t={t}
				/>
			)}
		</div>
	);
};
