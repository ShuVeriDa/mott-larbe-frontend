"use client";

import { type ComponentProps } from "react";
import { Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import type { Announcement } from "@/entities/announcement";

interface AnnouncementRowProps {
	announcement: Announcement;
	onDelete: (announcement: Announcement) => void;
}

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("ru-RU", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

export const AnnouncementRow = ({
	announcement,
	onDelete,
}: AnnouncementRowProps) => {
	const { t } = useI18n();

	const handleDeleteClick: NonNullable<ComponentProps<"button">["onClick"]> =
		() => onDelete(announcement);

	const handleCellClick: NonNullable<ComponentProps<"td">["onClick"]> = (e) =>
		e.stopPropagation();

	return (
		<TableRow className="border-b border-bd-1 transition-colors duration-150 ease-out last:border-b-0 hover:bg-surf-2">
			<TableCell className="px-2.5 py-[10px] pl-3.5">
				<span className="text-[12.5px] font-medium text-t-1">
					{announcement.title}
				</span>
			</TableCell>
			<TableCell className="px-2.5 py-[10px] max-sm:hidden">
				{announcement.body ? (
					<span className="line-clamp-2 text-[12px] text-t-3">
						{announcement.body}
					</span>
				) : (
					<span className="text-[12px] text-t-4">—</span>
				)}
			</TableCell>
			<TableCell className="px-2.5 py-[10px] max-sm:hidden">
				{announcement.textTitle ? (
					<span className="text-[12px] text-t-2">{announcement.textTitle}</span>
				) : (
					<span className="text-[12px] text-t-4">—</span>
				)}
			</TableCell>
			<TableCell className="px-2.5 py-[10px] text-[12px] text-t-3 max-sm:hidden">
				{formatDate(announcement.createdAt)}
			</TableCell>
			<TableCell
				className="px-2.5 py-[10px] pr-3.5"
				onClick={handleCellClick}
			>
				<Button
					variant="ghost"
					onClick={handleDeleteClick}
					aria-label={t("admin.announcements.deleteAriaLabel")}
					className="flex h-7 w-7 items-center justify-center rounded-md p-0 text-t-3 transition-colors duration-150 ease-out hover:bg-red-bg hover:text-red-t"
				>
					<Trash2 className="size-3.5" />
				</Button>
			</TableCell>
		</TableRow>
	);
};
