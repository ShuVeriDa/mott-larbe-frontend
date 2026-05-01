"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ProfileCard as SettingCard } from "../profile-card";

const DesktopIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-3.5">
		<rect x="2" y="3" width="12" height="8" rx="1.5" />
		<path d="M5 11v1.5M11 11v1.5M3.5 12.5h9" strokeLinecap="round" />
	</svg>
);

const PhoneIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-3.5">
		<rect x="4.5" y="1.5" width="7" height="12" rx="1.5" />
		<circle cx="8" cy="11.5" r=".8" fill="currentColor" stroke="none" />
	</svg>
);

interface SessionRow {
	id: string;
	icon: "desktop" | "phone";
	name: string;
	meta: string;
	current?: boolean;
}

const SESSIONS: SessionRow[] = [
	{ id: "curr", icon: "desktop", name: "Chrome · Windows", meta: "", current: true },
	{ id: "phone", icon: "phone", name: "Safari · iPhone", meta: "2d" },
];

export const ActiveSessionsCard = () => {
	const { t } = useI18n();
	const { success } = useToast();

	return (
		<SettingCard title={t("settings.sessions.heading")} noBody>
			{SESSIONS.map((s) => (
				<div
					key={s.id}
					className="flex items-center gap-3 border-b border-hairline border-bd-1 px-4 py-2.5 last:border-b-0"
				>
					<span className={`flex size-8 shrink-0 items-center justify-center rounded-[8px] ${s.current ? "bg-acc-bg text-acc-t" : "bg-surf-2 text-t-2"}`}>
						{s.icon === "phone" ? <PhoneIcon /> : <DesktopIcon />}
					</span>
					<div className="flex-1 min-w-0">
						<Typography tag="p" className="text-[12.5px] font-medium text-t-1 truncate">
							{s.name}
						</Typography>
						{s.current ? (
							<Typography tag="p" className="text-[11px] text-t-3">
								{t("settings.sessions.activeNow")}
							</Typography>
						) : (
							<Typography tag="p" className="text-[11px] text-t-3">
								{s.meta}
							</Typography>
						)}
					</div>
					{s.current ? (
						<span className="rounded bg-grn-bg px-1.5 py-0.5 text-[10.5px] font-semibold text-grn-t shrink-0">
							{t("settings.sessions.current")}
						</span>
					) : (
						<Button
							variant="outline"
							className="h-7 px-2.5 text-[11.5px] shrink-0"
							onClick={() => success(t("settings.toasts.sessionTerminated"))}
						>
							{t("settings.sessions.terminate")}
						</Button>
					)}
				</div>
			))}
		</SettingCard>
	);
};
