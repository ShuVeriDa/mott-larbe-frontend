"use client";

import type { UserSession } from "@/entities/auth";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Monitor, Smartphone } from "lucide-react";
import { type ComponentProps } from "react";

const DesktopIcon = () => <Monitor className="size-3.5" />;
const PhoneIcon = () => <Smartphone className="size-3.5" />;

const isPhone = (device: string) => /iphone|android|mobile|ipad/i.test(device);

export interface SessionRowProps {
	session: UserSession;
	onTerminate: (id: string) => void;
	isTerminating: boolean;
}

export const SessionRow = ({
	session,
	onTerminate,
	isTerminating,
}: SessionRowProps) => {
	const { t } = useI18n();
	const locationLabel =
		session.location?.city ?? t("profile.security.unknownLocation");

	const handleClick: NonNullable<ComponentProps<typeof Button>["onClick"]> =
		() => onTerminate(session.id);

	return (
		<div className="flex items-center gap-3 border-b-[0.5px] border-bd-1 px-4 py-2.5 last:border-b-0">
			<Typography
				tag="span"
				className={`flex size-8 shrink-0 items-center justify-center rounded-[8px] ${
					session.isCurrent ? "bg-acc-bg text-acc-t" : "bg-surf-2 text-t-2"
				}`}
			>
				{isPhone(session.device) ? <PhoneIcon /> : <DesktopIcon />}
			</Typography>
			<div className="flex-1 min-w-0">
				<Typography
					tag="p"
					className="text-[12.5px] font-medium text-t-1 truncate"
				>
					{session.device}
				</Typography>
				<Typography tag="p" className="text-[11px] text-t-3 truncate">
					{session.isCurrent ? t("settings.sessions.activeNow") : locationLabel}
				</Typography>
			</div>
			{session.isCurrent ? (
				<Typography
					tag="span"
					className="rounded bg-grn-bg px-1.5 py-0.5 text-[10.5px] font-semibold text-grn-t shrink-0"
				>
					{t("settings.sessions.current")}
				</Typography>
			) : (
				<Button
					variant="outline"
					className="h-7 px-2.5 text-[11.5px] shrink-0"
					disabled={isTerminating}
					onClick={handleClick}
				>
					{t("settings.sessions.terminate")}
				</Button>
			)}
		</div>
	);
};
