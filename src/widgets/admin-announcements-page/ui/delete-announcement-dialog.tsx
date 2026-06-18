"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { useI18n } from "@/shared/lib/i18n";
import type { Announcement } from "@/entities/announcement";

interface DeleteAnnouncementDialogProps {
	announcement: Announcement | null;
	isDeleting: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

export const DeleteAnnouncementDialog = ({
	announcement,
	isDeleting,
	onConfirm,
	onClose,
}: DeleteAnnouncementDialogProps) => {
	const { t } = useI18n();

	return (
		<Modal
			open={!!announcement}
			onClose={onClose}
			title={t("admin.announcements.deleteConfirm.title")}
			className="max-w-[420px]"
		>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
				{t("admin.announcements.deleteConfirm.description")}
			</Typography>

			{announcement && (
				<div className="mb-4 rounded-[8px] border border-bd-1 bg-bg px-3 py-2.5">
					<Typography
						tag="p"
						className="text-[13px] font-medium text-t-1 line-clamp-2"
					>
						{announcement.title}
					</Typography>
					{announcement.body && (
						<Typography tag="p" className="mt-0.5 text-[12px] text-t-3 line-clamp-2">
							{announcement.body}
						</Typography>
					)}
				</div>
			)}

			<ModalActions>
				<Button
					variant="ghost"
					onClick={onClose}
					disabled={isDeleting}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.announcements.deleteConfirm.cancel")}
				</Button>
				<Button
					variant="bare"
					onClick={onConfirm}
					disabled={isDeleting}
					className="h-[34px] flex-1 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85"
				>
					{isDeleting
						? t("admin.announcements.deleteConfirm.deleting")
						: t("admin.announcements.deleteConfirm.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
