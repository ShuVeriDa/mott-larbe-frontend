"use client";

import { useState } from "react";
import { useSettings } from "@/entities/settings";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type { SettingsSectionId } from "../model/section-list";
import { AppearanceSection } from "./sections/appearance-section";
import { DataSection } from "./sections/data-section";
import { LearningSection } from "./sections/learning-section";
import { NotificationsSection } from "./sections/notifications-section";
import { ReaderSection } from "./sections/reader-section";
import { SessionsSection } from "./sections/sessions-section";
import { ShortcutsSection } from "./sections/shortcuts-section";
import { SettingsNav } from "./settings-nav";
import { SettingsTopbar } from "./settings-topbar";

export const SettingsPage = () => {
	const { t } = useI18n();
	const { data, isLoading, isError } = useSettings();
	const [active, setActive] = useState<SettingsSectionId>("appearance");

	return (
		<>
			<SettingsTopbar />
			<div className="flex min-h-0 flex-1 overflow-hidden max-md:flex-col">
				<SettingsNav active={active} onChange={setActive} />
				<div
					className="flex flex-1 flex-col gap-0 overflow-y-auto px-6 pb-10 pt-5 max-md:px-4 max-sm:px-3 max-sm:pb-10 max-sm:pt-3.5"
				>
					{isLoading ? (
						<Typography tag="p" className="text-[13px] text-t-3">
							{t("settings.loading")}
						</Typography>
					) : isError || !data ? (
						<Typography tag="p" className="text-[13px] text-red-t">
							{t("settings.loadError")}
						</Typography>
					) : (
						<>
							{active === "appearance" ? (
								<AppearanceSection preferences={data.preferences} />
							) : null}
							{active === "learning" ? (
								<LearningSection
									preferences={data.preferences}
									goals={data.goals}
								/>
							) : null}
							{active === "reader" ? (
								<ReaderSection preferences={data.preferences} />
							) : null}
							{active === "notifications" ? (
								<NotificationsSection notifications={data.notifications} />
							) : null}
							{active === "shortcuts" ? <ShortcutsSection /> : null}
							{active === "sessions" ? <SessionsSection /> : null}
							{active === "data" ? <DataSection /> : null}
						</>
					)}
				</div>
			</div>
		</>
	);
};
