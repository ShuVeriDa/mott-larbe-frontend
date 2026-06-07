"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { SectionHeader } from "../section-header";
import { SettingCard } from "../setting-card";

interface ShortcutDef {
	labelKey: string;
	keys: string[];
}

interface ShortcutGroup {
	titleKey: string;
	items: ShortcutDef[];
}

const GROUPS: ShortcutGroup[] = [
	{
		titleKey: "settings.shortcuts.reader",
		items: [
			{ labelKey: "settings.shortcuts.nextPage", keys: ["→"] },
			{ labelKey: "settings.shortcuts.prevPage", keys: ["←"] },
			{ labelKey: "settings.shortcuts.closePopup", keys: ["Esc"] },
			{ labelKey: "settings.shortcuts.openSidebar", keys: ["Space"] },
			{ labelKey: "settings.shortcuts.addToDict", keys: ["A"] },
			{ labelKey: "settings.shortcuts.markKnown", keys: ["K"] },
			{ labelKey: "settings.shortcuts.suggestEdit", keys: ["E"] },
			{ labelKey: "settings.shortcuts.toggleNotes", keys: ["N"] },
			{ labelKey: "settings.shortcuts.toggleToc", keys: ["T"] },
			{ labelKey: "settings.shortcuts.toggleBookmarks", keys: ["B"] },
			{ labelKey: "settings.shortcuts.toggleFocus", keys: ["F"] },
			{ labelKey: "settings.shortcuts.toggleAiHistory", keys: ["H"] },
		],
	},
	{
		titleKey: "settings.shortcuts.reviewBlock",
		items: [
			{ labelKey: "settings.shortcuts.showTrans", keys: ["Space"] },
			{ labelKey: "settings.shortcuts.hard", keys: ["1", "←"] },
			{ labelKey: "settings.shortcuts.normal", keys: ["2"] },
			{ labelKey: "settings.shortcuts.easy", keys: ["4", "→"] },
			{ labelKey: "settings.shortcuts.skip", keys: ["S"] },
			{ labelKey: "settings.shortcuts.exitReview", keys: ["Q"] },
		],
	},
	{
		titleKey: "settings.shortcuts.deckReview",
		items: [
			{ labelKey: "settings.shortcuts.showTrans", keys: ["Space"] },
			{ labelKey: "settings.shortcuts.deckAgain", keys: ["←"] },
			{ labelKey: "settings.shortcuts.deckKnow", keys: ["→"] },
			{ labelKey: "settings.shortcuts.moveToRepeat", keys: ["R"] },
			{ labelKey: "settings.shortcuts.returnFromRepeat", keys: ["G"] },
			{ labelKey: "settings.shortcuts.exitReview", keys: ["Q"] },
		],
	},
	{
		titleKey: "settings.shortcuts.global",
		items: [
			{ labelKey: "settings.shortcuts.search", keys: ["⌘", "K"] },
			{ labelKey: "settings.shortcuts.goLibrary", keys: ["G", "L"] },
			{ labelKey: "settings.shortcuts.goVocab", keys: ["G", "V"] },
		],
	},
];

const KbdKey = ({ children }: { children: string }) => (
	<Typography
		tag="span"
		className="inline-flex h-5 min-w-[22px] items-center justify-center rounded-[4px] border-[0.5px] border-bd-2 bg-surf-2 px-1.5 text-[11px] font-medium text-t-2 shadow-[0_1px_0_var(--bd-2)]"
	>
		{children}
	</Typography>
);

export const ShortcutsSection = () => {
	const { t } = useI18n();

	return (
		<div className="flex flex-col gap-3.5">
			<SectionHeader
				title={t("settings.shortcuts.title")}
				subtitle={t("settings.shortcuts.sub")}
			/>
			{GROUPS.map(group => (
				<SettingCard key={group.titleKey} title={t(group.titleKey)} noBody>
					{group.items.map(item => (
						<div
							key={item.labelKey}
							className="flex items-center justify-between gap-2 border-b-[0.5px] border-bd-1 px-4 py-2.5 last:border-b-0 max-sm:flex-col max-sm:items-start max-sm:gap-1.5"
						>
							<Typography tag="span" className="text-[12.5px] text-t-2">
								{t(item.labelKey)}
							</Typography>
							<Typography tag="span" className="inline-flex items-center gap-1">
								{item.keys.map((k, i) => (
									<KbdKey key={`${item.labelKey}-${i}`}>{k}</KbdKey>
								))}
							</Typography>
						</div>
					))}
				</SettingCard>
			))}
		</div>
	);
};
