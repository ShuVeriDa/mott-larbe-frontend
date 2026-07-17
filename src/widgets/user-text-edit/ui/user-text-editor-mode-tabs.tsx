"use client";

import { useI18n } from "@/shared/lib/i18n";
import { TabBar, TabItem, Tabs } from "@/shared/ui/tabs";
import type { EditorMode } from "../model/use-user-text-edit-page";

interface UserTextEditorModeTabsProps {
	mode: EditorMode;
	disableWriteTab?: boolean;
	onModeChange: (mode: EditorMode) => void;
}

export const UserTextEditorModeTabs = ({
	mode,
	disableWriteTab = false,
	onModeChange,
}: UserTextEditorModeTabsProps) => {
	const { t } = useI18n();

	const handleValueChange = (value: string) =>
		onModeChange(value as EditorMode);

	return (
		<Tabs
			value={mode}
			onValueChange={handleValueChange}
			className="border-b border-bd-1 bg-surf px-[22px] py-1.5 max-sm:px-4"
		>
			<TabBar aria-label={t("myTexts.generate.modeTabs.label")}>
				<TabItem value="write" disabled={disableWriteTab}>
					{t("myTexts.generate.modeTabs.write")}
				</TabItem>
				<TabItem value="generate">{t("myTexts.generate.tabLabel")}</TabItem>
			</TabBar>
		</Tabs>
	);
};
