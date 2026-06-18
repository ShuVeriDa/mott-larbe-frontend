"use client";

import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/shared/ui/table";
import { useI18n } from "@/shared/lib/i18n";
import type { Announcement } from "@/entities/announcement";
import { AnnouncementRow } from "./announcement-row";

interface AnnouncementTableProps {
	announcements: Announcement[];
	isLoading: boolean;
	onDelete: (announcement: Announcement) => void;
}

const thClass =
	"px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap bg-surf-2";

export const AnnouncementTable = ({
	announcements,
	isLoading,
	onDelete,
}: AnnouncementTableProps) => {
	const { t } = useI18n();

	if (isLoading) {
		return (
			<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0">
				<Table
					className="w-full border-collapse text-[12.5px]"
					aria-busy="true"
				>
					<TableBody>
						{Array.from({ length: 5 }).map((_, i) => (
							<TableRow key={i} className="border-b border-bd-1">
								<TableCell className="px-2.5 py-[10px] pl-3.5">
									<div className="h-4 w-40 animate-pulse rounded-[5px] bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-[10px] max-sm:hidden">
									<div className="h-3 w-56 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-[10px] max-sm:hidden">
									<div className="h-3 w-24 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-[10px] max-sm:hidden">
									<div className="h-3 w-16 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell style={{ width: 52 }} />
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	if (announcements.length === 0) {
		return (
			<div className="py-16 text-center text-[13px] text-t-3">
				{t("admin.announcements.empty")}
			</div>
		);
	}

	return (
		<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0">
			<Table className="w-full border-collapse text-[12.5px]">
				<TableHeader>
					<TableRow className="border-b border-bd-1">
						<TableHead className={`${thClass} pl-3.5`}>
							{t("admin.announcements.table.colTitle")}
						</TableHead>
						<TableHead className={`${thClass} max-sm:hidden`}>
							{t("admin.announcements.table.colBody")}
						</TableHead>
						<TableHead className={`${thClass} max-sm:hidden`}>
							{t("admin.announcements.table.colText")}
						</TableHead>
						<TableHead className={`${thClass} max-sm:hidden`} style={{ width: 110 }}>
							{t("admin.announcements.table.colDate")}
						</TableHead>
						<TableHead className={thClass} style={{ width: 52 }} />
					</TableRow>
				</TableHeader>
				<TableBody>
					{announcements.map((announcement) => (
						<AnnouncementRow
							key={announcement.id}
							announcement={announcement}
							onDelete={onDelete}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
