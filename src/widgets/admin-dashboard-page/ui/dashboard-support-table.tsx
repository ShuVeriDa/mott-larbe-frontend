"use client";

import { Typography } from "@/shared/ui/typography";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { useParams } from "next/navigation";
import { cn } from "@/shared/lib/cn";
import type { AdminDashboardSupport } from "@/entities/admin-dashboard";

const STATUS_STYLES: Record<string, string> = {
	NEW: "bg-red-bg text-red-t",
	IN_PROGRESS: "bg-amb-bg text-amb-t",
	ANSWERED: "bg-acc-bg text-acc-t",
	RESOLVED: "bg-grn-bg text-grn-t",
};

const formatDateTime = (iso: string) => {
	const d = new Date(iso);
	const months = ["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"];
	return `${d.getDate()} ${months[d.getMonth()]}, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

interface DashboardSupportTableProps {
	support: AdminDashboardSupport;
}

export const DashboardSupportTable = ({ support }: DashboardSupportTableProps) => {
	const { t } = useI18n();
	const params = useParams<{ lang: string }>();

	const statusLabel = (s: string) => {
		const map: Record<string, Parameters<typeof t>[0]> = {
			NEW: "admin.dashboard.support.statusOpen",
			IN_PROGRESS: "admin.dashboard.support.statusInProgress",
			ANSWERED: "admin.dashboard.support.statusAnswered",
			RESOLVED: "admin.dashboard.support.statusResolved",
		};
		return t(map[s] ?? "admin.dashboard.support.statusOpen");
	};

	return (
		<div className="overflow-hidden rounded-[12px] border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center gap-2 px-4 py-3.5">
				<Typography tag="span" className="text-[13px] font-semibold text-t-1">
					{t("admin.dashboard.support.title")}
				</Typography>
				<div className="ml-auto flex items-center gap-2">
					{support.openCount > 0 && (
						<Typography tag="span" className="inline-flex items-center rounded-[5px] bg-red-bg px-1.5 py-0.5 text-[10.5px] font-semibold text-red-t">
							{t("admin.dashboard.support.openTickets").replace(
								"{count}",
								String(support.openCount),
							)}
						</Typography>
					)}
					<Link
						href={`/${params.lang}/admin/feedback`}
						className="shrink-0 text-[11.5px] text-acc hover:underline"
					>
						{t("admin.dashboard.support.all")}
					</Link>
				</div>
			</div>

			<div className="overflow-x-auto">
				<Table className="border-collapse text-[12.5px]" aria-label={t("admin.dashboard.support.title")}>
					<TableHeader>
						<TableRow className="border-b border-bd-1">
							<TableHead className="px-4 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("admin.dashboard.support.id")}
							</TableHead>
							<TableHead className="px-4 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("admin.dashboard.support.user")}
							</TableHead>
							<TableHead className="px-4 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("admin.dashboard.support.subject")}
							</TableHead>
							<TableHead className="px-4 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("admin.dashboard.support.status")}
							</TableHead>
							<TableHead className="px-4 pb-2 text-right text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("admin.dashboard.support.date")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{support.recentThreads.map((thread) => (
							<TableRow
								key={thread.id}
								className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2"
							>
								<TableCell className="px-4 py-2.5 text-t-2">
									#{thread.id.slice(-6).toUpperCase()}
								</TableCell>
								<TableCell className="px-4 py-2.5 text-t-1">{thread.userName}</TableCell>
								<TableCell className="max-w-[200px] px-4 py-2.5">
									<Typography tag="span" className="block truncate text-t-1">
										{thread.subject ?? t("admin.dashboard.support.noSubject")}
									</Typography>
								</TableCell>
								<TableCell className="px-4 py-2.5">
									<Typography tag="span"
										className={cn(
											"inline-flex items-center rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold",
											STATUS_STYLES[thread.status] ?? "bg-surf-3 text-t-2",
										)}
									>
										{statusLabel(thread.status)}
									</Typography>
								</TableCell>
								<TableCell className="px-4 py-2.5 text-right text-[11.5px] whitespace-nowrap text-t-3">
									{formatDateTime(thread.createdAt)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export const DashboardSupportTableSkeleton = () => (
	<div className="overflow-hidden rounded-[12px] border border-bd-1 bg-surf">
		<div className="flex items-center gap-2 px-4 py-3.5">
			<div className="h-3.5 w-36 animate-pulse rounded bg-surf-3" />
			<div className="ml-auto h-3 w-12 animate-pulse rounded bg-surf-3" />
		</div>
		<Table className="border-collapse text-[12.5px]" aria-busy="true" aria-label="Loading support tickets">
			<TableHeader>
				<TableRow className="border-b border-bd-1">
					{Array.from({ length: 5 }).map((_, i) => (
						<TableHead key={i} className="px-4 pb-2">
							<div className="h-2.5 w-12 animate-pulse rounded bg-surf-3" />
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{Array.from({ length: 5 }).map((_, i) => (
					<TableRow key={i} className="border-b border-bd-1 last:border-b-0">
						{Array.from({ length: 5 }).map((_, j) => (
							<TableCell key={j} className="px-4 py-2.5">
								<div className="h-3 animate-pulse rounded bg-surf-3" style={{ width: j === 2 ? "80%" : "60%" }} />
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	</div>
);
