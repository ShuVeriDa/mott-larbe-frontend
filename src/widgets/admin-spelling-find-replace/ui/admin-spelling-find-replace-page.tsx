"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Typography } from "@/shared/ui/typography";
import { AdminCard } from "@/shared/ui/admin-card";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import {
	SpellingOccurrenceTextFilter,
	SpellingFixBar,
	SpellingFixConfirmDialog,
	SpellingOccurrencesList,
	SpellingOccurrencesPagination,
} from "@/entities/spelling-dictionary";
import type { SpellingMatchType } from "@/entities/spelling-dictionary";
import { useAdminSpellingFindReplacePage } from "../model/use-admin-spelling-find-replace-page";
import { SpellingFindReplaceForm } from "./spelling-find-replace-form";

interface AdminSpellingFindReplacePageProps {
	initialWrongForm: string;
	initialMatchType: SpellingMatchType;
	initialCorrectForm: string;
	initialPage: number;
	initialTextIds: string[];
}

export const AdminSpellingFindReplacePage = ({
	initialWrongForm,
	initialMatchType,
	initialCorrectForm,
	initialPage,
	initialTextIds,
}: AdminSpellingFindReplacePageProps) => {
	const { t, lang } = useI18n();
	const {
		wrongFormInput,
		correctFormInput,
		matchType,
		items,
		total,
		page,
		limit,
		textIds,
		textOptions,
		textFilterSearch,
		selectedTokenIds,
		allSelected,
		someSelected,
		confirmOpen,
		fixErrorCount,
		canBulkFix,
		hasSearch,
		isLoading,
		isError,
		isTextOptionsLoading,
		isFixing,
		handleWrongFormChange,
		handleMatchTypeChange,
		handleCorrectFormChange,
		handlePageChange,
		handleLimitChange,
		handleTextFilterChange,
		handleTextFilterSearchChange,
		handleToggleSelect,
		handleSelectAll,
		handleOpenConfirm,
		handleCloseConfirm,
		handleFixSelected,
		handleFixOne,
	} = useAdminSpellingFindReplacePage({
		initialWrongForm,
		initialMatchType,
		initialCorrectForm,
		initialPage,
		initialTextIds,
	});

	return (
		<main className="flex min-h-0 flex-1 flex-col">
			<header className="flex items-center gap-3 border-b border-bd-1 bg-surf px-[18px] py-3 transition-colors">
				<Button variant="ghost" size="icon-sm" asChild>
					<Link href={`/${lang}/admin/spelling-dictionary`} aria-label={t("admin.spellingDictionaryFindReplace.back")}>
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<Typography tag="h1" className="font-display text-[16px] text-t-1">
					{t("admin.spellingDictionaryFindReplace.title")}
				</Typography>
			</header>

			<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-[18px] py-4 pb-8 max-sm:px-3 max-sm:pb-6">
				<AdminCard className="px-4 py-3.5">
					<SpellingFindReplaceForm
						wrongForm={wrongFormInput}
						matchType={matchType}
						correctForm={correctFormInput}
						onWrongFormChange={handleWrongFormChange}
						onMatchTypeChange={handleMatchTypeChange}
						onCorrectFormChange={handleCorrectFormChange}
					/>
				</AdminCard>

				{!hasSearch ? (
					<AdminCard className="py-16 text-center">
						<Typography tag="p" className="text-[13px] text-t-3">
							{t("admin.spellingDictionaryFindReplace.emptyQuery")}
						</Typography>
					</AdminCard>
				) : (
					<AdminCard className="flex min-h-0 flex-1 flex-col">
						<div className="flex items-center justify-between gap-3 border-b border-bd-1 px-4 py-3">
							<Typography tag="p" className="text-[13px] font-medium text-t-1">
								{t("admin.spellingDictionaryDetail.occurrences")}
							</Typography>
							<SpellingOccurrenceTextFilter
								textIds={textIds}
								options={textOptions}
								search={textFilterSearch}
								isLoading={isTextOptionsLoading}
								onChange={handleTextFilterChange}
								onSearchChange={handleTextFilterSearchChange}
							/>
						</div>

						<SpellingFixBar
							selectedCount={selectedTokenIds.size}
							canBulkFix={canBulkFix}
							onFixSelected={handleOpenConfirm}
						/>

						{fixErrorCount > 0 && (
							<div className="border-b border-bd-1 bg-red-50 px-4 py-2 text-[12px] text-red-700">
								{t("admin.spellingDictionaryDetail.fixPartialError", { count: fixErrorCount })}
							</div>
						)}

						{isError ? (
							<div className="py-12 text-center text-[13px] text-red-500">
								{t("admin.spellingDictionaryDetail.loadError")}
							</div>
						) : (
							<div className="min-h-0 flex-1 overflow-y-auto">
								<SpellingOccurrencesList
									items={items}
									lang={lang}
									isLoading={isLoading}
									canBulkFix={canBulkFix}
									selectedTokenIds={selectedTokenIds}
									allSelected={allSelected}
									someSelected={someSelected}
									onToggleSelect={handleToggleSelect}
									onSelectAll={handleSelectAll}
									onFixOne={handleFixOne}
								/>
							</div>
						)}

						{!isLoading && total > 0 && (
							<SpellingOccurrencesPagination
								page={page}
								limit={limit}
								total={total}
								onPageChange={handlePageChange}
								onLimitChange={handleLimitChange}
							/>
						)}
					</AdminCard>
				)}
			</div>

			<SpellingFixConfirmDialog
				open={confirmOpen}
				selectedCount={selectedTokenIds.size}
				wrongForm={wrongFormInput}
				correctForm={correctFormInput}
				isFixing={isFixing}
				onConfirm={handleFixSelected}
				onClose={handleCloseConfirm}
			/>
		</main>
	);
};
