"use client";

import type { DashboardResponse } from "@/entities/dashboard";
import type { UserProfile } from "@/entities/user";
import { useI18n } from "@/shared/lib/i18n";
import { LibraryPage, LibraryPageTopbar, useLibraryPage } from "@/widgets/library-page";
import { GreetingSection } from "./greeting-section";

interface DashboardContentProps {
	data: DashboardResponse;
	user: UserProfile | undefined;
	lang: string;
}

export const DashboardContent = ({
	data,
	user,
	lang,
}: DashboardContentProps) => {
	const { t } = useI18n();
	const libraryState = useLibraryPage();

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<LibraryPageTopbar title={t("dashboard.pageTitle")} state={libraryState} />

			<div className="flex flex-col gap-3.5 overflow-y-auto px-[22px] pb-4 pt-4 max-md:px-4 max-sm:px-3.5 max-sm:pt-3.5">
				<GreetingSection user={user} lang={lang} stats={data.stats} />
			</div>

			<LibraryPage hideTopbar state={libraryState} />
		</div>
	);
};
