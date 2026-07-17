"use client";

import { SectionLabel } from "@/shared/ui/section-label";
import { Typography } from "@/shared/ui/typography";

import type { TextToken } from "@/entities/text";
import { useWordLookup, type WordLookupResponse } from "@/entities/word";
import { LearnStatusRow } from "@/features/learn-status";
import { useWordLookupStore } from "@/features/word-lookup";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
} from "@/shared/ui/drawer";
import { WordPanelEmpty } from "@/widgets/word-panel";
import { AddToDictionaryButton } from "@/widgets/word-panel/ui/add-to-dictionary-button";
import { AiWordSheetBody } from "./ai-word-sheet-body";
import { ExternalLink, Pencil } from "lucide-react";
import type { MouseEvent } from "react";
import { useState } from "react";
import { useMediaQuery } from "@/shared/lib/media-query";
import { EntrySuggestModal } from "@/features/entry-suggest";
import { WordPanelContent } from "@/widgets/word-panel/ui/word-panel-content";

const SheetBody = ({
	token,
	lookup,
	textId,
	onExpand,
}: {
	token: TextToken;
	lookup: WordLookupResponse;
	textId: string;
	onExpand: () => void;
}) => {
	const { t } = useI18n();
	const [suggestOpen, setSuggestOpen] = useState(false);

	const handleSuggestOpen = () => setSuggestOpen(true);
	const handleSuggestChange = (open: boolean) => setSuggestOpen(open);
	const handleSuggestSuccess = () => {};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="min-h-0 flex-1 overflow-y-auto">
				<div className="border-b border-bd-1 px-4 pb-3">
					<div className="mb-1 font-display text-[20px] font-semibold tracking-[-0.3px] text-t-1">
						{token.original}
						{lookup.wordModern ? (
							<span className="ml-2 text-[14px] font-normal text-t-3">
								{lookup.wordModern}
							</span>
						) : null}
					</div>
					<div className="text-[12px] text-t-3">
						{t("reader.panel.baseForm")}:{" "}
						<Typography tag="strong" className="font-medium text-t-2">
							{lookup.baseForm}
						</Typography>
					</div>
				</div>
				<div className="border-b border-bd-1 px-4 py-3">
					<div className="mb-1 text-[15px] font-medium text-t-1">
						{lookup.translation}
					</div>
					{lookup.tranAlt ? (
						<div className="text-[13px] leading-normal text-t-3">
							{lookup.tranAlt}
						</div>
					) : null}
				</div>
				{lookup.tags.length > 0 ? (
					<div className="flex flex-wrap gap-1 border-b border-bd-1 px-4 py-2.5">
						{lookup.tags.map(tag => (
							<Typography
								tag="span"
								key={tag}
								className="rounded-[5px] border border-bd-1 bg-surf-2 px-2 py-0.5 text-[10.5px] font-medium text-t-2"
							>
								{tag}
							</Typography>
						))}
					</div>
				) : null}
				<div className="border-b border-bd-1 px-4 py-3">
					<SectionLabel>
						{t("reader.panel.sections.level")}
					</SectionLabel>
					{lookup.lemmaId && (
						<LearnStatusRow
							lemmaId={lookup.lemmaId}
							tokenId={token.id}
							textId={textId}
							current={lookup.userStatus}
						/>
					)}
				</div>
			</div>
			<div className="flex shrink-0 gap-2 border-t border-bd-1 px-4 pt-2.5 pb-[max(12px,env(safe-area-inset-bottom))]">
				<AddToDictionaryButton
					tokenId={token.id}
					word={token.original}
					translation={lookup.translation}
					inDictionary={lookup.inDictionary}
					dictionaryEntryId={lookup.dictionaryEntryId}
					currentFolderId={lookup.dictionaryFolder?.id ?? null}
					currentFolderName={lookup.dictionaryFolder?.name ?? null}
				/>
				<div className="flex shrink-0 gap-1">
					<Button
						onClick={handleSuggestOpen}
						aria-label={t("suggest.button")}
						title={t("suggest.button")}
						className="inline-flex size-9 shrink-0 items-center justify-center rounded-[8px] border border-bd-2 bg-surf-2 text-t-3 transition-colors hover:text-t-1"
					>
						<Pencil className="size-3.5" strokeWidth={1.6} />
					</Button>
					<Button
						onClick={onExpand}
						aria-label={t("reader.popup.openPanel")}
						title={t("reader.popup.openPanel")}
						className="inline-flex size-9 shrink-0 items-center justify-center rounded-[8px] border border-bd-2 bg-surf-2 text-t-3 transition-colors hover:text-t-1"
					>
						<ExternalLink className="size-3.5" strokeWidth={1.6} />
					</Button>
				</div>
			</div>
			<EntrySuggestModal
				open={suggestOpen}
				onOpenChange={handleSuggestChange}
				onSuccess={handleSuggestSuccess}
				normalized={token.normalized}
				rawWord={token.original}
				currentTranslation={lookup.translation ?? ""}
			/>
		</div>
	);
};

export const WordBottomSheet = ({ textId }: { textId: string }) => {
	const { t, lang } = useI18n();
	const surface = useWordLookupStore(s => s.surface);
	const token = useWordLookupStore(s => s.activeToken);
	const contentLanguage = useWordLookupStore(s => s.contentLanguage);
	const closeSheet = useWordLookupStore(s => s.closeSheet);

	const sheetExpanded = useWordLookupStore(s => s.sheetExpanded);
	const openInSheetExpanded = useWordLookupStore(s => s.openInSheetExpanded);

	const isMobile = !useMediaQuery("(min-width: 768px)");
	const sheetOpen = surface === "sheet" && isMobile;

	const handleExpand = () => { if (token) openInSheetExpanded(token); };
	const handleClose = () => closeSheet();
	const handleOpenChange = (open: boolean) => { if (!open) closeSheet(); };

	const { data, isLoading } = useWordLookup(
		sheetOpen && token ? token.id : null,
	);

	return (
		<Drawer open={sheetOpen} onOpenChange={handleOpenChange} shouldScaleBackground={false}>
			<DrawerContent className="max-h-[90dvh]" aria-describedby={undefined}>
				<DrawerTitle className="sr-only">
					{token?.original ?? t("reader.panel.label")}
				</DrawerTitle>
				{token ? (
					sheetExpanded ? (
						<div className="min-h-0 flex-1 overflow-y-auto">
							<WordPanelContent token={token} textId={textId} compact />
						</div>
					) : isLoading || !data ? (
						<div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-4 py-12 pb-4">
							<div className="size-[18px] animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
							<div className="text-[12px] text-t-3">
								{t("reader.popup.loading")}
							</div>
						</div>
					) : data.translation ? (
						<SheetBody
							token={token}
							lookup={data}
							textId={textId}
							onExpand={handleExpand}
						/>
					) : (
						<AiWordSheetBody
							word={token.original}
							normalized={token.normalized}
							lang={lang}
							contentLanguage={contentLanguage}
							tokenId={token.id}
							inDictionary={data.inDictionary}
							dictionaryEntryId={data.dictionaryEntryId}
							currentFolderId={data.dictionaryFolder?.id ?? null}
							currentFolderName={data.dictionaryFolder?.name ?? null}
						/>
					)
				) : (
					<div className="min-h-0 flex-1 overflow-y-auto p-4">
						<div className="flex min-h-[min(280px,50dvh)] flex-col justify-center py-8">
							<WordPanelEmpty />
						</div>
					</div>
				)}
			</DrawerContent>
		</Drawer>
	);
};
