"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { LaptopIcon, PhoneIcon, SessionsIcon } from "../settings-icons";
import { SectionHeader } from "../section-header";
import { SettingCard } from "../setting-card";

interface SessionItem {
	id: string;
	icon: "desktop" | "phone" | "laptop";
	name: string;
	meta: string;
	current?: boolean;
}

const SESSIONS: SessionItem[] = [
	{
		id: "current",
		icon: "desktop",
		name: "Chrome · Windows 11",
		meta: "Frankfurt, DE",
		current: true,
	},
	{
		id: "phone",
		icon: "phone",
		name: "Safari · iPhone 15",
		meta: "Москва, RU · 2h",
	},
	{
		id: "laptop",
		icon: "laptop",
		name: "Firefox · macOS Sonoma",
		meta: "Грозный, RU · 3d",
	},
];

const renderIcon = (kind: SessionItem["icon"]) => {
	const cls = "size-3.5 text-t-3";
	if (kind === "phone") return <PhoneIcon className={cls} />;
	if (kind === "laptop") return <LaptopIcon className={cls} />;
	return <SessionsIcon className={cls} />;
};

export const SessionsSection = () => {
	const { t } = useI18n();
	const { success } = useToast();

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
						onClick={() =>
							success(t("settings.toasts.allSessionsTerminated"))
						}
					>
						{t("settings.sessions.terminateAll")}
					</Button>
				}
				noBody
			>
				{SESSIONS.map((s) => (
					<div
						key={s.id}
						className="flex items-center gap-3 border-hairline border-b border-bd-1 px-4 py-2.5 last:border-b-0"
					>
						<span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] border-hairline border-bd-1 bg-surf-2">
							{renderIcon(s.icon)}
						</span>
						<div className="min-w-0 flex-1">
							<Typography
								tag="p"
								className="text-[12.5px] font-medium text-t-1 truncate"
							>
								{s.name}
							</Typography>
							<Typography tag="p" className="text-[11px] text-t-3">
								{s.meta}
								{s.current
									? ` · ${t("settings.sessions.activeNow")}`
									: ""}
							</Typography>
						</div>
						{s.current ? (
							<span className="rounded bg-grn-bg px-1.5 py-0.5 text-[10.5px] font-semibold text-grn-t">
								{t("settings.sessions.current")}
							</span>
						) : (
							<Button
								variant="outline"
								className="h-7 px-2.5 text-[11.5px]"
								onClick={() =>
									success(t("settings.toasts.sessionTerminated"))
								}
							>
								{t("settings.sessions.terminate")}
							</Button>
						)}
					</div>
				))}
			</SettingCard>
		</div>
	);
};
