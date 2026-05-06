"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { useFolders, useFoldersSummary, type Folder } from "@/entities/folder";
import { CreateFolderModal } from "@/features/create-folder";
import { DeleteFolderModal } from "@/features/delete-folder";
import { EditFolderModal } from "@/features/update-folder";
import { PremiumUpsellModal } from "@/shared/ui/premium-upsell-modal";
import { FoldersGrid } from "./folders-grid";
import { FoldersSummary } from "./folders-summary";
import { FoldersTopbar } from "./folders-topbar";
import { UncategorizedSection } from "./uncategorized-section";

const is403 = (error: unknown): boolean => {
	if (!error || typeof error !== "object") return false;
	const e = error as { response?: { status?: number } };
	return e.response?.status === 403;
};

export const VocabularyFoldersPage = () => {
	const { t } = useI18n();
	const { data: summary } = useFoldersSummary();
	const { error: foldersError } = useFolders();

	const [createOpen, setCreateOpen] = useState(false);
	const [editFolder, setEditFolder] = useState<Folder | null>(null);
	const [deleteFolder, setDeleteFolder] = useState<Folder | null>(null);
	const [upsellOpen, setUpsellOpen] = useState(false);

	useEffect(() => {
		if (is403(foldersError)) setUpsellOpen(true);
	}, [foldersError]);

	const showUpsell = () => setUpsellOpen(true);

	const max = summary?.maxFolders ?? -1;
	const used = summary?.foldersCount ?? 0;
	const limitReached = max > 0 && used >= max;
	const folderCreationDisabled = max === 0;

	const limitMessage = (() => {
		if (!summary) return null;
		if (max === 0) return t("vocabulary.foldersPage.section.limitDisabled");
		if (max < 0)
			return t("vocabulary.foldersPage.section.limitUnlimited", { used });
		return t("vocabulary.foldersPage.section.limitUsed", { used, max });
	})();

	return (
		<>
			<FoldersTopbar
				onCreate={() => setCreateOpen(true)}
				createDisabled={folderCreationDisabled || limitReached}
			/>

			<main className="flex flex-1 flex-col gap-5 overflow-y-auto bg-panel px-[26px] py-[22px] pb-10 max-md:px-[14px] max-md:py-[14px]">
				<section aria-labelledby="folders-summary-heading">
					<h2 id="folders-summary-heading" className="sr-only">
						{t("vocabulary.foldersPage.summary.foldersCount")}
					</h2>
					<FoldersSummary />
				</section>

				<section aria-labelledby="folders-list-heading">
					<div className="mb-3 flex items-center justify-between gap-3">
						<h2
							id="folders-list-heading"
							className="text-[13px] font-semibold text-t-1"
						>
							{t("vocabulary.foldersPage.section.title")}
						</h2>
						{limitMessage ? (
							<span className="text-[12px] text-t-3">{limitMessage}</span>
						) : null}
					</div>

					{limitReached ? (
						<div className="mb-3 rounded-card border-hairline border-amb/30 bg-amb-bg px-4 py-2.5 text-[12.5px] text-amb-t">
							{t("vocabulary.foldersPage.limitReached", { max })}
						</div>
					) : null}

					{folderCreationDisabled ? (
						<div className="mb-3 rounded-card border-hairline border-acc/30 bg-acc-bg px-4 py-2.5 text-[12.5px] text-acc-t">
							{t("vocabulary.foldersPage.premiumOnly")}
						</div>
					) : null}

					<FoldersGrid
						onCreate={() => setCreateOpen(true)}
						onEdit={(f) => setEditFolder(f)}
						onDelete={(f) => setDeleteFolder(f)}
						createDisabled={folderCreationDisabled || limitReached}
						onForbidden={showUpsell}
					/>
				</section>

				<section aria-labelledby="folders-uncat-heading">
					<h2 id="folders-uncat-heading" className="sr-only">
						{t("vocabulary.foldersPage.uncategorized.title")}
					</h2>
					<UncategorizedSection
						count={summary?.wordsWithoutFolder ?? 0}
					/>
				</section>
			</main>

			<CreateFolderModal
				open={createOpen}
				onClose={() => setCreateOpen(false)}
				onForbidden={showUpsell}
			/>
			<EditFolderModal
				open={!!editFolder}
				folder={editFolder}
				onClose={() => setEditFolder(null)}
			/>
			<DeleteFolderModal
				open={!!deleteFolder}
				folder={deleteFolder}
				onClose={() => setDeleteFolder(null)}
			/>
			<PremiumUpsellModal
				open={upsellOpen}
				onClose={() => setUpsellOpen(false)}
			/>
		</>
	);
};
