"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { ComponentProps } from 'react';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAdminUnknownWordsPage } from "../model/use-admin-unknown-words-page";
import { UnknownWordsTopbar } from "./unknown-words-topbar";
import { UnknownWordsStatsRow } from "./unknown-words-stats-row";
import { UnknownWordsTabs } from "./unknown-words-tabs";
import { UnknownWordsToolbar } from "./unknown-words-toolbar";
import { UnknownWordsBulkBar } from "./unknown-words-bulk-bar";
import { UnknownWordsTable } from "./unknown-words-table";
import { UnknownWordsMobileList } from "./unknown-words-mobile-list";
import { UnknownWordsPagination } from "./unknown-words-pagination";
import { UnknownWordsAddModal } from "./unknown-words-add-modal";
import { UnknownWordsClearModal } from "./unknown-words-clear-modal";
import { UnknownWordsContextsModal } from "./unknown-words-contexts-modal";
import { AdminAiCacheTab } from "./admin-ai-cache-tab";
import type { UnknownWordListItem } from "@/entities/admin-unknown-word";

type PageSection = "unknownWords" | "aiCache";

const SectionSwitcher = ({
  section,
  onChange,
}: {
  section: PageSection;
  onChange: (s: PageSection) => void;
}) => {
  const { t } = useI18n();
  const sections: { key: PageSection; label: string }[] = [
    { key: "unknownWords", label: t("admin.unknownWords.title") },
    { key: "aiCache", label: t("aiTranslation.admin.widget.title") },
  ];

  return (
    <div className="mb-3 flex gap-0.5 rounded-[9px] border border-bd-1 bg-surf-2 p-[3px] w-fit">
      {sections.map((s) => {
        const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange(s.key);
        return (
          <Button
            key={s.key}
            onClick={handleClick}
            className={cn(
              "flex h-7 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-base border-none px-[11px] font-sans text-[12.5px] transition-colors",
              section === s.key
                ? "bg-surf font-medium text-t-1 shadow-sm"
                : "bg-transparent text-t-2 hover:bg-surf-3 hover:text-t-1",
            )}
          >
            {s.label}
          </Button>
        );
      })}
    </div>
  );
};

export const AdminUnknownWordsPage = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const section = (searchParams.get("section") as PageSection) ?? "unknownWords";

	const handleSectionChange = (s: PageSection) => {
		const params = new URLSearchParams(searchParams.toString());
		if (s === "unknownWords") {
			params.delete("section");
		} else {
			params.set("section", s);
		}
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const {
		tab,
		search,
		sort,
		textId,
		page,
		selectedIds,
		allSelected,
		data,
		stats,
		isLoading,
		statsLoading,
		textsData,
		mutations,
		addModal,
		clearModalOpen,
		contextsModal,
		handleTabChange,
		handleSearchChange,
		handleSortChange,
		handleTextChange,
		handlePageChange,
		toggleSelectId,
		toggleSelectAll,
		clearSelection,
		openAddModal,
		closeAddModal,
		openContextsModal,
		closeContextsModal,
		handleAddToDictionary,
		handleLinkToLemma,
		handleExport,
		handleClearAll,
		setClearModalOpen,
	} = useAdminUnknownWordsPage();

	const selectedArray = Array.from(selectedIds);

	const handleOpenAdd = (word: UnknownWordListItem) => openAddModal(word, "new");
	const handleOpenLink = (word: UnknownWordListItem) => openAddModal(word, "link");

	const handleOpenClearAllModal: NonNullable<ComponentProps<typeof UnknownWordsTopbar>["onClearAll"]> = () =>
		setClearModalOpen(true);
	const handleBulkAddToDictionary: NonNullable<ComponentProps<typeof UnknownWordsBulkBar>["onAddToDictionary"]> = () => {
		if (selectedArray.length === 1 && data?.items) {
			const word = data.items.find(w => w.id === selectedArray[0]);
			if (word) handleOpenAdd(word);
		}
	};
	const handleBulkDelete: NonNullable<ComponentProps<typeof UnknownWordsBulkBar>["onDelete"]> = () =>
		mutations.bulkDelete.mutate(selectedArray, {
			onSuccess: clearSelection,
		});
	const handleClearModalClose: NonNullable<ComponentProps<typeof UnknownWordsClearModal>["onClose"]> = () =>
		setClearModalOpen(false);
return (
		<>
			<div className="flex min-h-0 flex-1 flex-col">
				<UnknownWordsTopbar
					onExport={handleExport}
					onClearAll={handleOpenClearAllModal}
				/>

				<div className="overflow-y-auto px-[18px] py-4 pb-8 max-sm:px-3 max-sm:pb-6">
					<SectionSwitcher section={section} onChange={handleSectionChange} />

					{section === "aiCache" ? (
						<AdminAiCacheTab />
					) : (
						<>
							<UnknownWordsStatsRow stats={stats} isLoading={statsLoading} />

							<UnknownWordsTabs
								active={tab}
								counts={data?.tabs}
								onChange={handleTabChange}
							/>

							<UnknownWordsToolbar
								search={search}
								sort={sort}
								textId={textId}
								texts={textsData ?? []}
								onSearchChange={handleSearchChange}
								onSortChange={handleSortChange}
								onTextChange={handleTextChange}
							/>

							{/* Table card */}
							<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
								<UnknownWordsBulkBar
									selectedCount={selectedIds.size}
									onAddToDictionary={handleBulkAddToDictionary}
									onDelete={handleBulkDelete}
									isPending={mutations.bulkDelete.isPending}
								/>

								<UnknownWordsTable
									words={data?.items ?? []}
									selectedIds={selectedIds}
									allSelected={allSelected}
									onToggleAll={toggleSelectAll}
									onToggleRow={toggleSelectId}
									mutations={mutations}
									isLoading={isLoading}
									onAddToDictionary={handleOpenAdd}
									onLinkToLemma={handleOpenLink}
									onViewContexts={openContextsModal}
								/>

								<UnknownWordsMobileList
									words={data?.items ?? []}
									mutations={mutations}
									isLoading={isLoading}
									onAddToDictionary={handleOpenAdd}
									onLinkToLemma={handleOpenLink}
									onViewContexts={openContextsModal}
								/>

								{!isLoading && data && (
									<UnknownWordsPagination
										page={page}
										limit={data.limit}
										total={data.total}
										onPageChange={handlePageChange}
									/>
								)}
							</div>
						</>
					)}
				</div>
			</div>

			<UnknownWordsAddModal
				state={addModal}
				isPending={
					mutations.addToDictionary.isPending || mutations.linkToLemma.isPending
				}
				onClose={closeAddModal}
				onSubmit={handleAddToDictionary}
				onLink={handleLinkToLemma}
			/>

			<UnknownWordsClearModal
				open={clearModalOpen}
				totalPending={stats?.totalPending ?? 0}
				isPending={mutations.clearAll.isPending}
				onClose={handleClearModalClose}
				onConfirm={handleClearAll}
			/>

			<UnknownWordsContextsModal
				state={contextsModal}
				onClose={closeContextsModal}
			/>
		</>
	);
};
