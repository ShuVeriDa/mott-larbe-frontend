"use client";
import { ComponentProps, useState } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useTerminateAllSessions } from "@/entities/auth";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { UserProfile } from "@/entities/user";
import { ProfileCard as SettingCard } from "../profile-card";
import { ChangePasswordModal } from "./change-password-modal";
import { ChangeEmailModal } from "./change-email-modal";

const LockIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-3.5">
		<rect x="4" y="7" width="8" height="7" rx="1.5" />
		<path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" strokeLinecap="round" />
	</svg>
);

const EmailIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-3.5">
		<rect x="2" y="4" width="12" height="9" rx="1.5" />
		<path d="M2 6l6 4 6-4" strokeLinecap="round" />
	</svg>
);

const SessionsIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-3.5">
		<rect x="2.5" y="2.5" width="11" height="11" rx="2" />
		<path d="M5.5 8l2 2 3-3" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

export interface SecurityCardProps {
	profile: UserProfile;
}

export const SecurityCard = ({ profile }: SecurityCardProps) => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const [passwordModalOpen, setPasswordModalOpen] = useState(false);
	const [emailModalOpen, setEmailModalOpen] = useState(false);
	const { mutate: terminateAll, isPending: terminatingAll } = useTerminateAllSessions();

	const handleTerminateAll = () => {
		terminateAll(undefined, {
			onSuccess: () => success(t("settings.toasts.allSessionsTerminated")),
			onError: () => error(t("profile.toasts.error")),
		});
	};

		const handleClick: NonNullable<ComponentProps<typeof Button>["onClick"]> = () => setPasswordModalOpen(true);
	const handleClick2: NonNullable<ComponentProps<typeof Button>["onClick"]> = () => setEmailModalOpen(true);
const rows = [
		{
			id: "password",
			Icon: LockIcon,
			iconBg: "bg-acc-bg text-acc-t",
			name: t("profile.security.password"),
			meta: t("profile.security.passwordMeta"),
			action: (
				<Button
					variant="outline"
					className="h-7 px-2.5 text-[11.5px] shrink-0"
					onClick={handleClick}
				>
					{t("profile.security.change")}
				</Button>
			),
		},
		{
			id: "email",
			Icon: EmailIcon,
			iconBg: "bg-grn-bg text-grn-t",
			name: t("profile.security.email"),
			meta: `${profile.email} · ${t("profile.security.verified")}`,
			action: (
				<Button
					variant="outline"
					className="h-7 px-2.5 text-[11.5px] shrink-0"
					onClick={handleClick2}
				>
					{t("profile.security.change")}
				</Button>
			),
		},
		{
			id: "sessions",
			Icon: SessionsIcon,
			iconBg: "bg-surf-2 text-t-2",
			name: t("profile.security.activeSessions"),
			meta: t("profile.security.activeSessionsMeta"),
			action: (
				<Button
					variant="outline"
					className="h-7 px-2.5 text-[11.5px] shrink-0"
					disabled={terminatingAll}
					onClick={handleTerminateAll}
				>
					{t("profile.security.terminateAll")}
				</Button>
			),
		},
	];

		const handleClose: NonNullable<ComponentProps<typeof ChangePasswordModal>["onClose"]> = () => setPasswordModalOpen(false);
	const handleClose2: NonNullable<ComponentProps<typeof ChangeEmailModal>["onClose"]> = () => setEmailModalOpen(false);
return (
		<>
			<SettingCard title={t("profile.security.title")} noBody>
				{rows.map((row) => (
					<div
						key={row.id}
						className="flex items-center gap-3 border-b border-hairline border-bd-1 px-4 py-3 last:border-b-0"
					>
						<Typography tag="span" className={`flex size-8 shrink-0 items-center justify-center rounded-[8px] ${row.iconBg}`}>
							<row.Icon />
						</Typography>
						<div className="flex-1 min-w-0">
							<Typography tag="p" className="text-[12.5px] font-medium text-t-1 mb-0.5">
								{row.name}
							</Typography>
							<Typography tag="p" className="text-[11px] text-t-3 truncate">
								{row.meta}
							</Typography>
						</div>
						{row.action}
					</div>
				))}
			</SettingCard>

			<ChangePasswordModal
				open={passwordModalOpen}
				onClose={handleClose}
			/>
			<ChangeEmailModal
				open={emailModalOpen}
				onClose={handleClose2}
			/>
		</>
	);
};
