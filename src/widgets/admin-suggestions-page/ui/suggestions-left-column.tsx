"use client";

import { ChangeEvent, ComponentProps } from "react";

import { Inbox } from "lucide-react";
import { SearchBox } from "@/shared/ui/search-box";
import { Select } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import type { Suggestion, SuggestionStatus } from "@/features/suggestions";
import { SuggestionListItem, SuggestionListItemSkeleton } from "./suggestion-list-item";

interface SuggestionsLeftColumnProps {
	items: Suggestion[];
	isLoading: boolean;
	selectedId: string | null;
	search: string;
	statusFilter: SuggestionStatus | undefined;
	onSearchChange: (v: string) => void;
	onStatusChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	onSelect: (id: string) => void;
	t: (key: string) => string;
}

export const SuggestionsLeftColumn = ({
	items,
	isLoading,
	selectedId,
	search,
	statusFilter,
	onSearchChange,
	onStatusChange,
	onSelect,
	t,
}: SuggestionsLeftColumnProps) => {
	const isEmpty = !isLoading && items.length === 0;

	const handleSearchChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		onSearchChange(e.currentTarget.value);

	return (
		<div className="flex flex-1 flex-col overflow-hidden border-r border-bd-1">
			<div className="flex shrink-0 gap-2 border-b border-bd-1 p-3">
				<SearchBox
					variant="toolbar"
					wrapperClassName="flex-1 h-[30px]"
					placeholder={`${t("adminSuggestions.word")}, ${t("adminSuggestions.author")}…`}
					value={search}
					onChange={handleSearchChange}
				/>
				<Select
					value={statusFilter ?? ""}
					onChange={onStatusChange}
					wrapperClassName="w-auto shrink-0"
					variant="sm"
				>
					<option value="">{t("adminSuggestions.filter.all")}</option>
					<option value="PENDING">{t("adminSuggestions.filter.pending")}</option>
					<option value="APPROVED">{t("adminSuggestions.filter.approved")}</option>
					<option value="REJECTED">{t("adminSuggestions.filter.rejected")}</option>
				</Select>
			</div>

			<div className="flex-1 overflow-y-auto">
				{isLoading
					? Array.from({ length: 8 }).map((_, i) => <SuggestionListItemSkeleton key={i} />)
					: isEmpty
						? (
							<div className="flex flex-col items-center px-4 py-12 text-center">
								<Inbox className="mb-3 size-8 text-t-4" />
								<Typography tag="p" className="text-[12.5px] text-t-3">
									{search || statusFilter
										? t("adminSuggestions.emptySearch")
										: t("adminSuggestions.empty")}
								</Typography>
							</div>
						)
						: items.map(item => (
							<SuggestionListItem
								key={item.id}
								item={item}
								isActive={item.id === selectedId}
								onSelect={onSelect}
								t={t}
							/>
						))}
			</div>
		</div>
	);
};
