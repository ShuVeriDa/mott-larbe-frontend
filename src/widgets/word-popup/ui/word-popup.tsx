"use client";

import { Typography } from "@/shared/ui/typography";

import type { TextToken } from "@/entities/text";
import { useWordLookup, type WordLookupResponse } from "@/entities/word";
import {
	useAddToVocabulary,
	useRemoveFromVocabulary,
} from "@/features/add-to-vocabulary";
import { useWordLookupStore, type PopupAnchor } from "@/features/word-lookup";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PagePhraseOccurrence } from "@/entities/admin-text-phrase";
import { AiWordPopupBody } from "./ai-word-popup-body";
import { EntrySuggestModal } from "@/features/entry-suggest";

const POPUP_WIDTH = 264;
const SAFE_MARGIN = 10;

const computePosition = (anchor: PopupAnchor, popupHeight: number) => {
	if (typeof window === "undefined") return { left: 0, top: 0 };
	let left = anchor.left + anchor.width / 2 - POPUP_WIDTH / 2;
	const topBelow = anchor.top + anchor.height + 8;
	const topAbove = anchor.top - popupHeight - 8;
	left = Math.max(
		SAFE_MARGIN,
		Math.min(left, window.innerWidth - POPUP_WIDTH - SAFE_MARGIN),
	);
	const fitsBelow = topBelow + popupHeight <= window.innerHeight - SAFE_MARGIN;
	const top = fitsBelow ? topBelow : Math.max(SAFE_MARGIN, topAbove);
	return { left, top };
};

// ── Word popup body ───────────────────────────────────────────────────────────

const WordPopupBody = ({
	token,
	lookup,
	onOpenInPanel,
	onSuggestOpen,
}: {
	token: TextToken;
	lookup: WordLookupResponse;
	onOpenInPanel: () => void;
	onSuggestOpen: () => void;
}) => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const { mutate: add, isPending: adding } = useAddToVocabulary();
	const { mutate: remove, isPending: removing } = useRemoveFromVocabulary();
	const isPending = adding || removing;

	const onPrimary = () => {
		if (lookup.inDictionary && lookup.dictionaryEntryId) {
			remove(
				{ dictionaryEntryId: lookup.dictionaryEntryId, tokenId: token.id },
				{
					onSuccess: () => success(t("reader.toasts.removedFromDict")),
					onError: () => error(t("reader.toasts.dictFailed")),
				},
			);
			return;
		}
		add(
			{ tokenId: token.id },
			{
				onSuccess: () => success(t("reader.toasts.addedToDict")),
				onError: () => error(t("reader.toasts.dictFailed")),
			},
		);
	};

	return (
		<>
			<div className="border-b border-hairline border-bd-1 px-3.5 pt-3.5 pb-2.5">
				<div className="mb-1 flex items-start gap-2">
					<div className="text-[17px] font-semibold tracking-[-0.2px] text-t-1">
						{token.original}
					</div>
					{lookup.wordLevel ? (
						<Typography
							tag="span"
							className={`mt-0.5 shrink-0 rounded-[4px] border-hairline px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.4px] ${
								lookup.wordLevel === "A" ? "bg-grn/15 text-grn border-grn/30" :
								lookup.wordLevel === "B" ? "bg-acc/15 text-acc border-acc/30" :
								"bg-red/15 text-red border-red/30"
							}`}
						>
							{lookup.wordLevel}
						</Typography>
					) : null}
				</div>
				<div className="text-[11.5px] text-t-3">
					{t("reader.panel.baseForm")}:{" "}
					<Typography tag="strong" className="font-medium text-t-2">
						{lookup.baseForm}
					</Typography>
				</div>
			</div>
			<div className="border-b border-hairline border-bd-1 px-3.5 py-2.5">
				<div className={lookup.lemmaTranslation ? "mb-1 text-[14px] font-medium text-t-1" : "text-[14px] font-medium text-t-1"}>
					{lookup.translation}
				</div>
				{lookup.lemmaTranslation ? (
					<div className="text-[11.5px] text-t-3">
						{t("reader.panel.baseForm")}:{" "}
						<Typography tag="span" className="font-medium text-t-2">
							{lookup.lemmaTranslation}
						</Typography>
					</div>
				) : null}
			</div>
			{lookup.tags.length > 0 ? (
				<div className="flex flex-wrap gap-1 border-b border-hairline border-bd-1 px-3.5 py-2">
					{lookup.tags.slice(0, 3).map(tag => (
						<Typography
							tag="span"
							key={tag}
							className="rounded-[4px] border-hairline border-bd-1 bg-surf-2 px-[7px] py-0.5 text-[10.5px] font-medium text-t-2"
						>
							{tag}
						</Typography>
					))}
				</div>
			) : null}
			<div className="flex gap-1.5 p-2.5">
				<Button
					onClick={onPrimary}
					disabled={isPending}
					title={lookup.inDictionary ? t("reader.popup.inDictionary") : t("reader.popup.addToDictionary")}
					className={cn(
						"flex h-[30px] flex-1 items-center justify-center gap-1.5 rounded-base text-[11.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60",
						lookup.inDictionary ? "bg-grn" : "bg-acc",
					)}
				>
					<Plus className="size-3" strokeWidth={1.8} />
					{lookup.inDictionary
						? t("reader.popup.inDictionary")
						: t("reader.popup.addToDictionary")}
				</Button>
					<Button
					size={"bare"}
					onClick={onSuggestOpen}
					aria-label={t("suggest.button")}
					title={t("suggest.button")}
					className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-base border-hairline border-bd-1 bg-surf-2 text-t-2 transition-colors hover:border-bd-2 hover:bg-surf-3 hover:text-t-1"
				>
					<Pencil className="size-3.5" strokeWidth={1.4} />
				</Button>
				<Button
					size={"bare"}
					onClick={onOpenInPanel}
					aria-label={t("reader.popup.openPanel")}
					title={t("reader.popup.openPanel")}
					className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-base border-hairline border-bd-1 bg-surf-2 text-t-2 transition-colors hover:border-bd-2 hover:bg-surf-3 hover:text-t-1"
				>
					<ExternalLink className="size-3.5" strokeWidth={1.4} />
				</Button>
			</div>
		</>
	);
};

// ── Phrase popup body ─────────────────────────────────────────────────────────

const PhrasePopupBody = ({ phrase }: { phrase: PagePhraseOccurrence }) => {
	const { t } = useI18n();
	return (
		<>
			<div className="border-b border-hairline border-bd-1 px-3.5 pt-3.5 pb-2.5">
				<div className="mb-1 flex items-center gap-1.5">
					<Typography tag="span" className="rounded-[4px] border-hairline border-pur/30 bg-pur-bg px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px] text-pur-t">
						{t("reader.phrase.label")}
					</Typography>
				</div>
				<div className="text-[17px] font-semibold tracking-[-0.2px] text-t-1">
					{phrase.phrase.original}
				</div>
			</div>
			<div className="px-3.5 py-2.5">
				<div className="text-[14px] font-medium text-t-1">
					{phrase.phrase.translation}
				</div>
				{phrase.phrase.notes && (
					<div className="mt-1 text-[12px] text-t-3">{phrase.phrase.notes}</div>
				)}
			</div>
		</>
	);
};

// ── Main popup ────────────────────────────────────────────────────────────────

export const WordPopup = () => {
	const { t, lang } = useI18n();
	const surface = useWordLookupStore(s => s.surface);
	const token = useWordLookupStore(s => s.activeToken);
	const phrase = useWordLookupStore(s => s.activePhrase);
	const contextSentence = useWordLookupStore(s => s.contextSentence);
	const anchor = useWordLookupStore(s => s.anchor);
	const closePopup = useWordLookupStore(s => s.closePopup);
	const openInPanel = useWordLookupStore(s => s.openInPanel);
	const [suggestOpen, setSuggestOpen] = useState(false);
	const [suggestWord, setSuggestWord] = useState<{ normalized: string; rawWord: string; currentTranslation: string } | null>(null);
	const popupRef = useRef<HTMLDivElement>(null);
	const [popupHeight, setPopupHeight] = useState(220);

	const isVisible = surface === "popup" && Boolean(anchor) && (Boolean(token) || Boolean(phrase));

	const { data, isLoading } = useWordLookup(
		isVisible && token ? token.id : null,
	);

	const position = anchor ? computePosition(anchor, popupHeight) : { left: 0, top: 0 };

	useEffect(() => {
		const el = popupRef.current;
		if (!el) return;
		const observer = new ResizeObserver(entries => {
			const h = entries[0]?.contentRect.height;
			if (h && h > 0) setPopupHeight(h);
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [isVisible]);

	const handleSuggestOpen = (normalized: string, rawWord: string, currentTranslation: string) => {
		setSuggestWord({ normalized, rawWord, currentTranslation });
		setSuggestOpen(true);
	};

	const handleSuggestChange = (open: boolean) => setSuggestOpen(open);

	const handleBackdropClick = () => {
		if (!suggestOpen) closePopup();
	};

	useEffect(() => {
		if (!isVisible) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !suggestOpen) closePopup();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [isVisible, closePopup, suggestOpen]);

	if (typeof window === "undefined") return null;

	return (
		<>
			{isVisible && createPortal(
				<>
					<div
						className="fixed inset-0 z-199"
						onClick={handleBackdropClick}
						aria-hidden="true"
					/>
					<div
						ref={popupRef}
						role="dialog"
						aria-label={token?.original ?? phrase?.phrase.original}
						className="fixed z-200 w-[264px] overflow-hidden rounded-card border-hairline border-bd-2 bg-surf shadow-lg"
						style={{ left: position.left, top: position.top }}
					>
						{phrase ? (
							<PhrasePopupBody phrase={phrase} />
						) : token ? (
							isLoading || !data ? (
								<div className="flex flex-col items-center justify-center gap-2 p-6">
									<div className="size-[18px] animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
									<div className="text-[12px] text-t-3">
										{t("reader.popup.loading")}
									</div>
								</div>
							) : data.translation ? (
								<WordPopupBody
									token={token}
									lookup={data}
									onOpenInPanel={() => openInPanel(token)}
									onSuggestOpen={() => handleSuggestOpen(token.normalized, token.original, data.translation ?? "")}
								/>
							) : (
								<AiWordPopupBody
									word={token.original}
									normalized={token.normalized}
									contextSentence={contextSentence}
									lang={lang}
								/>
							)
						) : null}
					</div>
				</>,
				document.body,
			)}
			{suggestWord && (
				<EntrySuggestModal
					open={suggestOpen}
					onOpenChange={handleSuggestChange}
					onSuccess={closePopup}
					normalized={suggestWord.normalized}
					rawWord={suggestWord.rawWord}
					currentTranslation={suggestWord.currentTranslation}
				/>
			)}
		</>
	);
};
