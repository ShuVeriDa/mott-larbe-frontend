"use client";

import { ComponentProps } from 'react';
import {
	useSessions,
	useTerminateAllSessions,
	useTerminateSession,
} from "@/entities/auth";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { LaptopIcon, PhoneIcon, SessionsIcon } from "../settings-icons";
import { SectionHeader } from "../section-header";
import { SettingCard } from "../setting-card";

const resolveIcon = (device: string) => {
	const lower = device.toLowerCase();
	if (/iphone|ipad|android/.test(lower)) return "phone" as const;
	if (/macbook|laptop/.test(lower)) return "laptop" as const;
	return "desktop" as const;
};

const renderIcon = (kind: "desktop" | "phone" | "laptop") => {
	const cls = "size-3.5 text-t-3";
	if (kind === "phone") return <PhoneIcon className={cls} />;
	if (kind === "laptop") return <LaptopIcon className={cls} />;
	return <SessionsIcon className={cls} />;
};

const formatDate = (iso: string) => {
	const diff = Date.now() - new Date(iso).getTime();
	const minutes = Math.floor(diff / 60_000);
	if (minutes < 2) return null;
	if (minutes < 60) return `${minutes}m`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h`;
	return `${Math.floor(hours / 24)}d`;
};

export const SessionsSection = () => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const { data: sessions = [], isLoading, isError } = useSessions();
	const terminateOne = useTerminateSession();
	const terminateAll = useTerminateAllSessions();

	const handleTerminate = async (id: string) => {
		try {
			await terminateOne.mutateAsync(id);
			success(t("settings.toasts.sessionTerminated"));
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

	const handleTerminateAll = async () => {
		try {
			await terminateAll.mutateAsync();
			success(t("settings.toasts.allSessionsTerminated"));
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

	return (
		<div className="flex flex-col gap-3.5">
			<SectionHeader
				title={t("settings.sessions.title")}
				subtitle={t("settings.sessions.sub")}
			/>

			<SettingCard
				title={t("settings.sessions.heading")}
				headExtra={
					<Button
						variant="outline"
						onClick={handleTerminateAll}
						disabled={terminateAll.isPending || sessions.length <= 1}
					>
						{t("settings.sessions.terminateAll")}
					</Button>
				}
				noBody
			>
				{isLoading && (
					<div className="px-4 py-3">
						<Typography tag="p" className="text-[12px] text-t-3">
							{t("settings.loading")}
						</Typography>
					</div>
				)}

				{isError && (
					<div className="px-4 py-3">
						<Typography tag="p" className="text-[12px] text-red-t">
							{t("settings.loadError")}
						</Typography>
					</div>
				)}

				{!isLoading &&
					!isError &&
					sessions.map((s) => {
						const age = formatDate(s.createdAt);
						const icon = resolveIcon(s.device);
						const isTerminating =
							terminateOne.isPending && terminateOne.variables === s.id;

												const handleClick: NonNullable<ComponentProps<typeof Button>["onClick"]> = () => handleTerminate(s.id);
return (
							<div
								key={s.id}
								className="flex items-center gap-3 border-hairline border-b border-bd-1 px-4 py-2.5 last:border-b-0"
							>
								<span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] border-hairline border-bd-1 bg-surf-2">
									{renderIcon(icon)}
								</span>
								<div className="min-w-0 flex-1">
									<Typography
										tag="p"
										className="truncate text-[12.5px] font-medium text-t-1"
									>
										{s.device}
									</Typography>
									<Typography tag="p" className="text-[11px] text-t-3">
										{s.ipAddress}
										{age ? ` · ${age}` : ""}
										{s.isCurrent
											? ` · ${t("settings.sessions.activeNow")}`
											: ""}
									</Typography>
								</div>
								{s.isCurrent ? (
									<span className="rounded bg-grn-bg px-1.5 py-0.5 text-[10.5px] font-semibold text-grn-t">
										{t("settings.sessions.current")}
									</span>
								) : (
									<Button
										variant="outline"
										className="h-7 px-2.5 text-[11.5px]"
										onClick={handleClick}
										disabled={isTerminating}
									>
										{t("settings.sessions.terminate")}
									</Button>
								)}
							</div>
						);
					})}
			</SettingCard>
		</div>
	);
};
