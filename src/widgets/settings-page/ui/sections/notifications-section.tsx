"use client";

import { useState, type SyntheticEvent } from "react";
import {
	useUpdateNotifications,
	type UserNotifications,
} from "@/entities/settings";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { SectionHeader } from "../section-header";
import { SettingCard } from "../setting-card";
import { ToggleRow } from "../toggle-row";

export interface NotificationsSectionProps {
	notifications: UserNotifications;
}

const TIMEZONE_OPTIONS = [
	{ value: "Europe/Moscow", labelKey: "settings.timezones.moscow" },
	{ value: "Europe/London", labelKey: "settings.timezones.london" },
	{ value: "Europe/Berlin", labelKey: "settings.timezones.berlin" },
	{ value: "Asia/Tashkent", labelKey: "settings.timezones.tashkent" },
];

export const NotificationsSection = ({
	notifications,
}: NotificationsSectionProps) => {
	const { t } = useI18n();
	const { mutateAsync, isPending } = useUpdateNotifications();
	const { success, error } = useToast();

	const [reminderTime, setReminderTime] = useState(notifications.reminderTime);
	const [timezone, setTimezone] = useState(notifications.timezone);

	const toggle = async (patch: Partial<UserNotifications>) => {
		try {
			await mutateAsync(patch);
			success(t("settings.toasts.saved"));
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

	const handleScheduleSave = async (
		e: SyntheticEvent<HTMLFormElement, SubmitEvent>,
	) => {
		e.preventDefault();
		try {
			await mutateAsync({ reminderTime, timezone });
			success(t("settings.toasts.notificationsSaved"));
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

	return (
		<div className="flex flex-col gap-3.5">
			<SectionHeader
				title={t("settings.notifications.title")}
				subtitle={t("settings.notifications.sub")}
			/>

			<SettingCard title={t("settings.notifications.email")} noBody>
				<ToggleRow
					label={t("settings.notifications.repeatReminder")}
					description={t("settings.notifications.repeatReminderDesc")}
					checked={notifications.repeatReminder}
					onChange={(v) => toggle({ repeatReminder: v })}
				/>
				<ToggleRow
					label={t("settings.notifications.weeklyReport")}
					description={t("settings.notifications.weeklyReportDesc")}
					checked={notifications.weeklyReport}
					onChange={(v) => toggle({ weeklyReport: v })}
				/>
				<ToggleRow
					label={t("settings.notifications.newTexts")}
					description={t("settings.notifications.newTextsDesc")}
					checked={notifications.newTexts}
					onChange={(v) => toggle({ newTexts: v })}
				/>
				<ToggleRow
					label={t("settings.notifications.supportReplies")}
					description={t("settings.notifications.supportRepliesDesc")}
					checked={notifications.supportReplies}
					onChange={(v) => toggle({ supportReplies: v })}
				/>
				<ToggleRow
					label={t("settings.notifications.marketing")}
					description={t("settings.notifications.marketingDesc")}
					checked={notifications.marketing}
					onChange={(v) => toggle({ marketing: v })}
				/>
			</SettingCard>

			<SettingCard title={t("settings.notifications.reminderSchedule")}>
				<form onSubmit={handleScheduleSave} className="flex flex-col gap-3">
					<div className="flex gap-2.5 max-sm:flex-col">
						<div className="flex-1">
							<InputLabel htmlFor="reminder-time">
								{t("settings.notifications.reminderTime")}
							</InputLabel>
							<Input
								id="reminder-time"
								type="time"
								value={reminderTime}
								onChange={(e) => setReminderTime(e.target.value)}
								className="max-w-[140px]"
							/>
						</div>
						<div className="flex-1">
							<InputLabel htmlFor="timezone">
								{t("settings.notifications.timezone")}
							</InputLabel>
							<Select
								id="timezone"
								value={timezone}
								onChange={(e) => setTimezone(e.target.value)}
							>
								{TIMEZONE_OPTIONS.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{t(opt.labelKey)}
									</option>
								))}
							</Select>
						</div>
					</div>
					<div className="mt-1 flex justify-end">
						<Button type="submit" variant="action" disabled={isPending}>
							{isPending
								? t("settings.common.saving")
								: t("settings.common.save")}
						</Button>
					</div>
				</form>
			</SettingCard>
		</div>
	);
};
