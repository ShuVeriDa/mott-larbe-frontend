"use client";

import { useI18n } from "@/shared/lib/i18n";
import { MasteryRing, useDictionaryStats } from "@/entities/dictionary";
import { SidebarSection } from "../sidebar-section";
import { StatsList } from "../stats-list";
import { FoldersList } from "../folders-list";

export interface VocabularySidebarProps {
	onCreateFolder: () => void;
}

export const VocabularySidebar = ({ onCreateFolder }: VocabularySidebarProps) => {
	const { t } = useI18n();
	const { data: stats } = useDictionaryStats();

	return (
		<aside
			className="flex w-[220px] shrink-0 flex-col gap-[18px] overflow-y-auto border-hairline border-r border-bd-1 bg-surf p-[16px_14px] transition-colors duration-200 max-md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			aria-label={t("vocabulary.title")}
		>
			<SidebarSection title={t("vocabulary.mastery")}>
				<MasteryRing
					percent={stats?.masteryPercent ?? 0}
					known={stats?.byLevel.KNOWN ?? 0}
					total={stats?.total ?? 0}
				/>
			</SidebarSection>

			{stats ? (
				<SidebarSection title={t("vocabulary.stats")}>
					<StatsList stats={stats} />
				</SidebarSection>
			) : null}

			<SidebarSection title={t("vocabulary.folders")}>
				<FoldersList
					totalAllWords={stats?.total ?? 0}
					onCreateFolder={onCreateFolder}
				/>
			</SidebarSection>
		</aside>
	);
};
