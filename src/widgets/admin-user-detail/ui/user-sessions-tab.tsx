"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { useAdminUserSessions } from "@/entities/admin-user/model/use-admin-user-sessions";
import { cn } from "@/shared/lib/cn";
import { Monitor } from "lucide-react";

interface UserSessionsTabProps {
	sessions: ReturnType<typeof useAdminUserSessions>;
}

export const UserSessionsTab = ({ sessions }: UserSessionsTabProps) => {
	const { t } = useI18n();
	const items = sessions.query.data ?? [];
	const isLoading = sessions.query.isLoading;

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => sessions.logoutAll.mutate();
return (
		<>
			<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0">
				<Table className="w-full border-collapse text-[12.5px]" aria-label={t("admin.userDetail.events.device")}>
					<TableHeader>
						<TableRow className="border-b border-bd-1">
							<TableHead className="px-3.5 py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
								{t("admin.userDetail.events.device")}
							</TableHead>
							<TableHead className="px-2.5 py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
								{t("admin.userDetail.events.ip")}
							</TableHead>
							<TableHead className="px-2.5 py-2 text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
								{t("admin.userDetail.events.lastActivity")}
							</TableHead>
							<TableHead className="px-3.5 py-2 text-right text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3">
								{t("admin.userDetail.events.status")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading
							? Array.from({ length: 3 }).map((_, i) => (
									<TableRow key={i} className="border-b border-bd-1">
										<TableCell className="px-3.5 py-2">
											<div className="h-3 w-36 animate-pulse rounded bg-surf-3" />
										</TableCell>
										<TableCell className="px-2.5 py-2">
											<div className="h-3 w-24 animate-pulse rounded bg-surf-3" />
										</TableCell>
										<TableCell className="px-2.5 py-2">
											<div className="h-3 w-20 animate-pulse rounded bg-surf-3" />
										</TableCell>
										<TableCell className="px-3.5 py-2 text-right">
											<div className="ml-auto h-4 w-14 animate-pulse rounded bg-surf-3" />
										</TableCell>
									</TableRow>
								))
							: items.map((session) => {
									const lastActive = new Date(session.lastActiveAt).toLocaleString(
										"ru-RU",
										{
											day: "numeric",
											month: "short",
											hour: "2-digit",
											minute: "2-digit",
										},
									);
									return (
										<TableRow
											key={session.id}
											className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2"
										>
											<TableCell className="px-3.5 py-2">
												<div className="text-[12.5px] font-medium text-t-1">
													{session.device ?? session.userAgent ?? "—"}
												</div>
												{session.isLatest && (
													<div className="text-[11px] text-t-3">
														{t("admin.userDetail.events.currentSession")}
													</div>
												)}
											</TableCell>
											<TableCell className="px-2.5 py-2 font-mono text-[11px] text-t-2">
												{session.ipAddress ?? "—"}
											</TableCell>
											<TableCell className="px-2.5 py-2 text-[11px] text-t-3">{lastActive}</TableCell>
											<TableCell className="px-3.5 py-2 text-right">
												{session.isActive ? (
													<Typography tag="span" className="inline-flex items-center gap-1 rounded-[5px] bg-grn-bg px-1.5 py-0.5 text-[10px] font-semibold text-grn-t">
														<Typography tag="span" className="size-[5px] shrink-0 rounded-full bg-grn" />
														{t("admin.userDetail.events.sessionActive")}
													</Typography>
												) : (
													<Typography tag="span" className="inline-flex items-center rounded-[5px] bg-surf-3 px-1.5 py-0.5 text-[10px] font-semibold text-t-2">
														{t("admin.userDetail.events.sessionExpired")}
													</Typography>
												)}
											</TableCell>
										</TableRow>
									);
								})}
					</TableBody>
				</Table>
			</div>

			<div className="flex justify-end border-t border-bd-1 px-3.5 py-2.5">
				<Button
					onClick={handleClick}
					disabled={sessions.logoutAll.isPending}
					title={t("admin.userDetail.actions.resetSessions")}
					className={cn(
						"flex h-7 items-center gap-1.5 rounded-base border border-red/25 bg-transparent px-2.5 text-[12px] font-medium text-red-t transition-colors hover:bg-red-bg disabled:opacity-50",
					)}
				>
					<Monitor className="size-3" />
					{t("admin.userDetail.actions.resetSessions")}
				</Button>
			</div>
		</>
	);
};
