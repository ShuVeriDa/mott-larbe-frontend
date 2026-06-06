"use client";

import { Typography } from "@/shared/ui/typography";

import type { TextToken } from "@/entities/text";
import { useWordLookup, type WordLookupResponse } from "@/entities/word";
import { LearnStatusRow } from "@/features/learn-status";
import { useWordLookupStore } from "@/features/word-lookup";
import { useFocusTrap } from "@/shared/lib/focus-trap/use-focus-trap";
import { useScrollLock } from "@/shared/lib/scroll-lock/use-scroll-lock";
import { useSwipe } from "@/shared/lib/swipe/use-swipe";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import {
	READER_MOBILE_SHEET_OVERLAY_CLASSES,
	ReaderMobileSheetHeader,
} from "@/shared/ui/reader-mobile-sheet-header";
import { SheetDragHandle } from "@/shared/ui/sheet-drag-handle";
import { WordPanelEmpty } from "@/widgets/word-panel";
import { AddToDictionaryButton } from "@/widgets/word-panel/ui/add-to-dictionary-button";
import { AiWordSheetBody } from "./ai-word-sheet-body";
import { Pencil, X } from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EntrySuggestModal } from "@/features/entry-suggest";

const SheetBody = ({
	token,
	lookup,
	textId,
	onClose,
}: {
	token: TextToken;
	lookup: WordLookupResponse;
	textId: string;
	onClose: () => void;
}) => {
	const { t } = useI18n();
	const [suggestOpen, setSuggestOpen] = useState(false);

	const handleSuggestChange = (open: boolean) => setSuggestOpen(open);
	const handleSuggestSuccess = () => onClose();

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="min-h-0 flex-1 overflow-y-auto">
				<div className="border-b border-bd-1 px-4 pb-3.5">
					<div className="mb-1 font-display text-[22px] font-semibold tracking-[-0.3px] text-t-1">
						{token.original}
					</div>
					<div className="text-[12px] text-t-3">
						{t("reader.panel.baseForm")}:{" "}
						<Typography tag="strong" className="font-medium text-t-2">
							{lookup.baseForm}
						</Typography>
					</div>
				</div>
				<div className="border-b border-bd-1 px-4 py-3.5">
					<div className="mb-1 text-[16px] font-medium text-t-1">
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
				<div className="border-b border-bd-1 px-4 py-3.5">
					<div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.6px] text-t-3">
						{t("reader.panel.sections.level")}
					</div>
					<LearnStatusRow
						lemmaId={lookup.lemmaId}
						tokenId={token.id}
						textId={textId}
						current={lookup.userStatus}
					/>
				</div>
			</div>
			<div className="flex shrink-0 gap-2 border-t border-bd-1 px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
				<AddToDictionaryButton
					tokenId={token.id}
					word={token.original}
					translation={lookup.translation}
					inDictionary={lookup.inDictionary}
					dictionaryEntryId={lookup.dictionaryEntryId}
					currentFolderId={lookup.dictionaryFolder?.id ?? null}
					currentFolderName={lookup.dictionaryFolder?.name ?? null}
					className="h-11 rounded-[10px] text-[14px]"
				/>
				<Button
					onClick={() => setSuggestOpen(true)}
					aria-label={t("suggest.button")}
					title={t("suggest.button")}
					className="inline-flex h-11 shrink-0 items-center justify-center rounded-[10px] border border-bd-2 bg-surf-2 px-3 text-t-2"
				>
					<Pencil className="size-4" strokeWidth={1.6} />
				</Button>
				<Button
					onClick={onClose}
					aria-label={t("reader.sheet.close")}
					title={t("reader.sheet.close")}
					className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-[10px] border border-bd-2 bg-surf-2 px-4 text-[14px] font-semibold text-t-2"
				>
					<X className="size-4" strokeWidth={1.6} />
					{t("reader.sheet.close")}
				</Button>
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
	const closeSheet = useWordLookupStore(s => s.closeSheet);

	const sheetOpen = surface === "sheet";

	const { data, isLoading } = useWordLookup(
		sheetOpen && token ? token.id : null,
	);
	const dialogRef = useRef<HTMLDivElement>(null);
	useScrollLock(sheetOpen);
	useFocusTrap(dialogRef, sheetOpen);

	useEffect(() => {
		if (!sheetOpen) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") closeSheet();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [sheetOpen, closeSheet]);

	const handleBackdropClick = () => closeSheet();
	const handleSheetClick = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
	};
	const swipe = useSwipe({ onSwipeDown: closeSheet });

	if (!sheetOpen || typeof window === "undefined") return null;

	return createPortal(
		<div
			role="presentation"
			className={READER_MOBILE_SHEET_OVERLAY_CLASSES}
			onClick={handleBackdropClick}
		>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-label={token?.original ?? t("reader.panel.label")}
				className="flex max-h-[90dvh] min-h-0 w-full flex-col rounded-t-2xl border-t border-bd-1 bg-surf"
				onClick={handleSheetClick}
				onPointerDown={swipe.onPointerDown}
				onPointerUp={swipe.onPointerUp}
				onPointerCancel={swipe.onPointerCancel}
			>
				<SheetDragHandle />
				<ReaderMobileSheetHeader
					title={t("reader.panel.label")}
					closeAriaLabel={t("reader.panel.close")}
					onClose={closeSheet}
				/>
				{token ? (
					isLoading || !data ? (
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
							onClose={closeSheet}
						/>
					) : (
						<AiWordSheetBody
							word={token.original}
							normalized={token.normalized}
							lang={lang}
							onClose={closeSheet}
						/>
					)
				) : (
					<div className="min-h-0 flex-1 overflow-y-auto p-4">
						<div className="flex min-h-[min(280px,50dvh)] flex-col justify-center py-8">
							<WordPanelEmpty />
						</div>
					</div>
				)}
			</div>
		</div>,
		document.body,
	);
};
