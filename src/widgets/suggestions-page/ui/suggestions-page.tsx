"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { AdminListColumn } from "@/shared/ui/admin-list-column";
import { useSuggestionsPage } from "../model/use-suggestions-page";
import { SuggestionListItem, SuggestionListItemSkeleton } from "./suggestion-list-item";
import { TextSubmissionListItem, TextSubmissionListItemSkeleton } from "./text-submission-list-item";
import { SuggestionDetailPanel } from "./suggestion-detail-panel";
import { TextSubmissionDetailPanel } from "./text-submission-detail-panel";

export const SuggestionsPage = () => {
	const { t } = useI18n();

	const {
		tab, handleTabChange,
		suggestions, wordTotal, wordLoading,
		statusFilter, wordOrder, wordPage, wordPageSize,
		wordSelectedId, selectedSuggestion,
		handleStatusFilterChange, handleWordOrderChange,
		handleWordPageChange, handleWordPageSizeChange,
		handleSelectSuggestion,
		textSubmissions, tsTotal, tsLoading,
		tsStatusFilter, tsOrder, tsPage, tsPageSize,
		tsSelectedId, selectedTextSubmission,
		handleTsStatusFilterChange, handleTsOrderChange,
		handleTsPageChange, handleTsPageSizeChange,
		handleSelectTextSubmission,
		showDetail, handleBack,
	} = useSuggestionsPage();

	const statusOptions = [
		{ value: "", label: t("adminSuggestions.filter.all") },
		{ value: "PENDING", label: t("adminSuggestions.filter.pending") },
		{ value: "APPROVED", label: t("adminSuggestions.filter.approved") },
		{ value: "REJECTED", label: t("adminSuggestions.filter.rejected") },
	];

	const sortOptions = [
		{ value: "desc", label: t("adminSuggestions.sortNewest") },
		{ value: "asc", label: t("adminSuggestions.sortOldest") },
	];

	return (
		<div className="flex h-full flex-col overflow-hidden">
			{/* Header */}
			<header className="flex shrink-0 items-center gap-3 border-b border-bd-1 bg-surf px-[22px] py-3 max-sm:px-4">
				<h1 className="text-[13.5px] font-semibold text-t-1">
					{t("suggestions.title")}
				</h1>

				<div className="flex w-fit gap-[2px] rounded-[8px] border border-bd-1 bg-surf-2 p-[3px]">
					<Button
						onClick={() => handleTabChange("word-edits")}
						className={cn(
							"flex h-[26px] items-center whitespace-nowrap rounded-[5px] px-3 text-[12px] font-medium transition-colors",
							tab === "word-edits" ? "bg-surf text-t-1 shadow-sm" : "text-t-3 hover:text-t-2",
						)}
					>
						{t("adminSuggestions.typeFilter.entry")}
					</Button>
					<Button
						onClick={() => handleTabChange("text-submissions")}
						className={cn(
							"flex h-[26px] items-center whitespace-nowrap rounded-[5px] px-3 text-[12px] font-medium transition-colors",
							tab === "text-submissions" ? "bg-surf text-t-1 shadow-sm" : "text-t-3 hover:text-t-2",
						)}
					>
						{t("myTextSubmissions.title")}
					</Button>
				</div>
			</header>

			{/* Two-column layout */}
			<div className="relative flex flex-1 overflow-hidden">
				{/* Left column */}
				<div className="flex w-[300px] shrink-0 flex-col overflow-hidden bg-surf max-sm:w-full">
					{tab === "word-edits" ? (
						<AdminListColumn
							items={suggestions}
							isLoading={wordLoading}
							statusFilter={statusFilter}
							order={wordOrder}
							page={wordPage}
							pageSize={wordPageSize}
							total={wordTotal}
							searchPlaceholder=""
							statusOptions={statusOptions}
							sortOptions={sortOptions}
							emptyText={t("suggestions.empty")}
							emptySearchText={t("suggestions.empty")}
							onStatusChange={handleStatusFilterChange}
							onOrderChange={handleWordOrderChange}
							onPageChange={handleWordPageChange}
							onPageSizeChange={handleWordPageSizeChange}
							renderItem={(item) => (
								<SuggestionListItem
									key={item.id}
									item={item}
									isActive={item.id === wordSelectedId}
									onSelect={handleSelectSuggestion}
									t={t}
								/>
							)}
							renderSkeleton={(i) => <SuggestionListItemSkeleton key={i} />}
						/>
					) : (
						<AdminListColumn
							items={textSubmissions}
							isLoading={tsLoading}
							statusFilter={tsStatusFilter}
							order={tsOrder}
							page={tsPage}
							pageSize={tsPageSize}
							total={tsTotal}
							searchPlaceholder=""
							statusOptions={statusOptions}
							sortOptions={sortOptions}
							emptyText={t("myTextSubmissions.empty")}
							emptySearchText={t("myTextSubmissions.empty")}
							onStatusChange={handleTsStatusFilterChange}
							onOrderChange={handleTsOrderChange}
							onPageChange={handleTsPageChange}
							onPageSizeChange={handleTsPageSizeChange}
							renderItem={(item) => (
								<TextSubmissionListItem
									key={item.id}
									item={item}
									isActive={item.id === tsSelectedId}
									onSelect={handleSelectTextSubmission}
									t={t}
								/>
							)}
							renderSkeleton={(i) => <TextSubmissionListItemSkeleton key={i} />}
						/>
					)}
				</div>

				{/* Right panel — desktop */}
				<div className="relative min-w-0 flex-1 overflow-hidden border-l border-bd-1 bg-surf max-sm:hidden sm:block">
					{tab === "word-edits" ? (
						<SuggestionDetailPanel
							suggestion={selectedSuggestion}
							showDetail={showDetail}
							onBack={handleBack}
						/>
					) : (
						<TextSubmissionDetailPanel
							submission={selectedTextSubmission}
							showDetail={showDetail}
							onBack={handleBack}
						/>
					)}
				</div>

				{/* Mobile overlay */}
				{showDetail && (
					<div className="absolute inset-0 z-10 bg-surf sm:hidden">
						{tab === "word-edits" ? (
							<SuggestionDetailPanel
								suggestion={selectedSuggestion}
								showDetail={showDetail}
								onBack={handleBack}
							/>
						) : (
							<TextSubmissionDetailPanel
								submission={selectedTextSubmission}
								showDetail={showDetail}
								onBack={handleBack}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
