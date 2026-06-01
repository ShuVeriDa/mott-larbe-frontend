"use client";

import { useSessions, useTerminateSession } from "@/entities/auth";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Typography } from "@/shared/ui/typography";
import { ProfileCard as SettingCard } from "../profile-card";
import { SessionRow } from "./session-row";

export const ActiveSessionsCard = () => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const { data: sessions = [], isLoading } = useSessions();
	const { mutate: terminate, isPending } = useTerminateSession();

	const handleTerminate = (id: string) => {
		terminate(id, {
			onSuccess: () => success(t("settings.toasts.sessionTerminated")),
			onError: () => error(t("profile.toasts.error")),
		});
	};

	return (
		<SettingCard title={t("settings.sessions.heading")} noBody>
			{isLoading ? (
				<div className="px-4 py-4">
					<Typography tag="p" className="text-[12px] text-t-3">
						{t("profile.loading")}
					</Typography>
				</div>
			) : sessions.length === 0 ? null : (
				sessions.map(session => (
					<SessionRow
						key={session.id}
						session={session}
						onTerminate={handleTerminate}
						isTerminating={isPending}
					/>
				))
			)}
		</SettingCard>
	);
};
