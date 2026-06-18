"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { AdminCard } from "@/shared/ui/admin-card";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import { useAdminAnnouncementsPage } from "../model/use-admin-announcements-page";
import { AnnouncementTable } from "./announcement-table";
import { CreateAnnouncementModal } from "./create-announcement-modal";
import { DeleteAnnouncementDialog } from "./delete-announcement-dialog";

export const AdminAnnouncementsPage = () => {
	const { t } = useI18n();
	const {
		announcements,
		query,
		modalOpen,
		deleteTarget,
		isCreating,
		isDeleting,
		handleOpenCreate,
		handleModalClose,
		handleCreate,
		handleOpenDelete,
		handleDeleteClose,
		handleDeleteConfirm,
	} = useAdminAnnouncementsPage();

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<header className="flex items-center gap-3 border-b border-bd-1 bg-surf px-[18px] py-3 transition-colors">
				<div>
					<Typography tag="h1" className="font-display text-[16px] text-t-1">
						{t("admin.announcements.pageTitle")}
					</Typography>
					<Typography tag="p" className="mt-px text-[12px] text-t-3">
						{t("admin.announcements.pageSubtitle")}
					</Typography>
				</div>
				<div className="ml-auto shrink-0">
					<Button
						onClick={handleOpenCreate}
						className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-88"
					>
						<Plus className="size-[13px]" />
						<Typography tag="span" className="max-sm:hidden">
							{t("admin.announcements.createButton")}
						</Typography>
					</Button>
				</div>
			</header>

			<div className="overflow-y-auto px-[18px] py-4 pb-8 max-sm:px-3 max-sm:pb-6">
				<AdminCard>
					<div className="border-b border-bd-1 px-4 py-3">
						<Typography tag="p" className="text-[13px] font-medium text-t-1">
							{t("admin.announcements.pageTitle")}
						</Typography>
					</div>

					{query.isError ? (
						<div className="py-12 text-center text-[13px] text-red-500">
							{t("admin.announcements.loadError")}
						</div>
					) : (
						<AnnouncementTable
							announcements={announcements}
							isLoading={query.isPending}
							onDelete={handleOpenDelete}
						/>
					)}
				</AdminCard>
			</div>

			<CreateAnnouncementModal
				open={modalOpen}
				isSubmitting={isCreating}
				onSubmit={handleCreate}
				onClose={handleModalClose}
			/>

			<DeleteAnnouncementDialog
				announcement={deleteTarget}
				isDeleting={isDeleting}
				onConfirm={handleDeleteConfirm}
				onClose={handleDeleteClose}
			/>
		</div>
	);
};
