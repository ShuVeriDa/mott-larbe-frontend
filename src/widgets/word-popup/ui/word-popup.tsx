"use client";

import type { PagePhraseOccurrence } from "@/entities/admin-text-phrase";
import { useSettings } from "@/entities/settings";
import type { TextToken } from "@/entities/text";
import { useWordLookup, type WordLookupResponse } from "@/entities/word";
import { EntrySuggestModal } from "@/features/entry-suggest";
import { useWordLookupStore, type PopupAnchor } from "@/features/word-lookup";
import { variants } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { KbdShortcut, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { AddToDictionaryButton } from "@/widgets/word-panel/ui/add-to-dictionary-button";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ExternalLink, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AiWordPopupBody } from "./ai-word-popup-body";

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
	showGrammar,
	showExamples,
	onOpenInPanel,
	onSuggestOpen,
}: {
	token: TextToken;
	lookup: WordLookupResponse;
	showGrammar: boolean;
	showExamples: boolean;
	onOpenInPanel: () => void;
	onSuggestOpen: () => void;
}) => {
	const { t } = useI18n();

	return (
		<>
			{/* Шапка: слово + badge */}
			<div className="border-b-[0.5px] border-bd-1 px-3.5 pt-3.5 pb-2.5">
				<div className="flex items-start gap-2">
					<div className="text-[17px] font-semibold tracking-[-0.2px] text-t-1">
						{token.original}
						{lookup.wordModern ? (
							<span className="ml-1.5 text-[13px] font-normal text-t-3">
								{lookup.wordModern}
							</span>
						) : null}
					</div>
					<span className="mt-0.5 flex shrink-0 items-center gap-1 rounded-[4px] border-[0.5px] border-grn/30 bg-grn/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px] text-grn">
						<BookOpen className="size-2.5" strokeWidth={1.8} />
						{t("reader.popup.badge")}
					</span>
					{lookup.wordLevel ? (
						<span
							className={`mt-0.5 flex shrink-0 items-center rounded-[4px] border-[0.5px] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px] ${
								lookup.wordLevel === "A"
									? "border-grn/30 bg-grn/15 text-grn"
									: lookup.wordLevel === "B"
										? "border-acc/30 bg-acc/15 text-acc"
										: "border-red/30 bg-red/15 text-red"
							}`}
						>
							{lookup.wordLevel}
						</span>
					) : null}
				</div>
			</div>

			{/* Тело: перевод + мета */}
			<div className="border-b-[0.5px] border-bd-1 px-3.5 py-2.5">
				<div className="text-[14px] font-medium text-t-1">
					{lookup.translation}
				</div>
				{lookup.baseForm ? (
					<div className="mt-1 text-[11.5px] text-t-3">
						{t("reader.panel.baseForm")}:{" "}
						<span className="font-medium text-t-2">{lookup.baseForm}</span>
					</div>
				) : null}
				{showGrammar && lookup.grammar
					? (() => {
							const key = lookup.grammar.replace(/\.$/, "");
							const nah = t(`posNah.${key}`);
							const label = t(`posLabel.${key}`);
							const display =
								nah !== `posNah.${key}`
									? `${nah} / ${label !== `posLabel.${key}` ? label : lookup.grammar}`
									: lookup.grammar;
							return (
								<div className="mt-0.5 text-[11.5px] text-t-3">
									{t("aiTranslation.popup.partOfSpeech")}:{" "}
									<span className="text-t-2">{display}</span>
								</div>
							);
						})()
					: null}
				{showGrammar && (lookup.nounClass ?? lookup.nounClassPlural) ? (
					<div className="mt-0.5 text-[11.5px] text-t-3">
						{t("reader.popup.nounClass")}:{" "}
						<span className="text-t-2">
							{lookup.nounClass ?? "—"} / {lookup.nounClassPlural ?? "—"}
						</span>
					</div>
				) : null}
				{showExamples && lookup.meanings[0]?.examples[0] ? (
					<div className="mt-1.5 text-[11.5px] italic text-t-3">
						{lookup.meanings[0].examples[0].text}{" "}
						{lookup.meanings[0].examples[0].translation ? (
							<span className="not-italic">
								— {lookup.meanings[0].examples[0].translation}
							</span>
						) : null}
					</div>
				) : null}
			</div>

			{/* Футер: кнопки */}
			<div className="flex items-center justify-between gap-2 px-3.5 py-2">
				<AddToDictionaryButton
					tokenId={token.id}
					word={token.original}
					translation={lookup.translation}
					inDictionary={lookup.inDictionary}
					dictionaryEntryId={lookup.dictionaryEntryId}
					currentFolderId={lookup.dictionaryFolder?.id ?? null}
					currentFolderName={lookup.dictionaryFolder?.name ?? null}
					className="h-7 text-[11.5px]"
				/>
				<div className="flex gap-1.5">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size="bare"
								onClick={onSuggestOpen}
								aria-label={t("suggest.button")}
								className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-base border-[0.5px] border-bd-1 bg-surf-2 text-t-3 transition-colors hover:border-bd-2 hover:bg-surf-3 hover:text-t-1"
							>
								<Pencil className="size-3" strokeWidth={1.5} />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="top" sideOffset={6}>
							{t("suggest.button")} <KbdShortcut keys={["E"]} />
						</TooltipContent>
					</Tooltip>
					<Button
						size="bare"
						onClick={onOpenInPanel}
						aria-label={t("reader.popup.openPanel")}
						title={t("reader.popup.openPanel")}
						className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-base border-[0.5px] border-bd-1 bg-surf-2 text-t-3 transition-colors hover:border-bd-2 hover:bg-surf-3 hover:text-t-1"
					>
						<ExternalLink className="size-3" strokeWidth={1.5} />
					</Button>
				</div>
			</div>
		</>
	);
};

// ── Phrase popup body ─────────────────────────────────────────────────────────

const PhrasePopupBody = ({ phrase }: { phrase: PagePhraseOccurrence }) => {
	const { t } = useI18n();
	return (
		<>
			<div className="border-b-[0.5px] border-bd-1 px-3.5 pt-3.5 pb-2.5">
				<div className="mb-1.5 flex items-start justify-between gap-2">
					<div className="flex items-start gap-2">
						<div className="text-[17px] font-semibold tracking-[-0.2px] text-t-1">
							{phrase.phrase.original}
						</div>
						<span className="mt-0.5 flex shrink-0 items-center gap-1 rounded-[4px] border-[0.5px] border-pur/30 bg-pur-bg px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px] text-pur-t">
							{t("reader.phrase.label")}
						</span>
					</div>
				</div>
			</div>
			<div className="border-b-[0.5px] border-bd-1 px-3.5 py-2.5">
				<div className="flex items-start justify-between gap-2">
					<div className="text-[14px] font-medium text-t-1">
						{phrase.phrase.translation}
					</div>
				</div>
				{phrase.phrase.notes && (
					<div className="mt-1 text-[11.5px] text-t-3">
						{phrase.phrase.notes}
					</div>
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
	const contentLanguage = useWordLookupStore(s => s.contentLanguage);
	const closePopup = useWordLookupStore(s => s.closePopup);
	const openInPanel = useWordLookupStore(s => s.openInPanel);
	const openInSheetExpanded = useWordLookupStore(s => s.openInSheetExpanded);

	const handleOpenInPanel = (t: typeof token) => {
		if (!t) return;
		const isMobile = typeof window !== "undefined" && window.innerWidth <= 767;
		if (isMobile) {
			closePopup();
			openInSheetExpanded(t, contextSentence);
		} else {
			openInPanel(t, contextSentence);
		}
	};
	const { data: settings } = useSettings();
	const showGrammar = settings?.preferences.showGrammar ?? true;
	const showExamples = settings?.preferences.showExamples ?? true;
	const autoAddOnClick = settings?.preferences.autoAddOnClick ?? false;
	const [suggestOpen, setSuggestOpen] = useState(false);
	const [suggestWord, setSuggestWord] = useState<{
		normalized: string;
		rawWord: string;
		currentTranslation: string;
	} | null>(null);
	const popupRef = useRef<HTMLDivElement>(null);
	const [popupHeight, setPopupHeight] = useState(220);

	const isVisible =
		surface === "popup" &&
		Boolean(anchor) &&
		(Boolean(token) || Boolean(phrase));

	const { data, isLoading } = useWordLookup(
		isVisible && token ? token.id : null,
	);


	const position = anchor
		? computePosition(anchor, popupHeight)
		: { left: 0, top: 0 };

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

	const handleSuggestOpen = (
		normalized: string,
		rawWord: string,
		currentTranslation: string,
	) => {
		setSuggestWord({ normalized, rawWord, currentTranslation });
		setSuggestOpen(true);
	};

	const handleSuggestChange = (open: boolean) => setSuggestOpen(open);

	useEffect(() => {
		if (!isVisible) return;
		const onMouseDown = (event: MouseEvent) => {
			if (suggestOpen) return;
			if (
				popupRef.current &&
				!popupRef.current.contains(event.target as Node)
			) {
				closePopup();
			}
		};
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !suggestOpen) { closePopup(); return; }
			if ((event.key === "e" || event.key === "E") && !suggestOpen && token && data?.translation) {
				event.preventDefault();
				handleSuggestOpen(token.normalized, token.original, data.translation);
			}
		};
		document.addEventListener("mousedown", onMouseDown);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onMouseDown);
			document.removeEventListener("keydown", onKey);
		};
	}, [isVisible, closePopup, suggestOpen, token, data, handleSuggestOpen]);

	if (typeof window === "undefined") return null;

	return (
		<>
			{createPortal(
				<AnimatePresence>
					{isVisible && (
						<motion.div
							ref={popupRef}
							role="dialog"
							aria-label={token?.original ?? phrase?.phrase.original}
							className="fixed z-200 w-[264px] overflow-hidden rounded-card border-[0.5px] border-bd-2 bg-surf shadow-lg"
							style={{ left: position.left, top: position.top }}
							variants={variants.scaleIn}
							initial="hidden"
							animate="visible"
							exit="exit"
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
										showGrammar={showGrammar}
										showExamples={showExamples}
										onOpenInPanel={() => handleOpenInPanel(token)}
										onSuggestOpen={() =>
											handleSuggestOpen(
												token.normalized,
												token.original,
												data.translation ?? "",
											)
										}
									/>
								) : (
									<AiWordPopupBody
										word={token.original}
										normalized={token.normalized}
										contextSentence={contextSentence}
										lang={lang}
										contentLanguage={contentLanguage}
										tokenId={token.id}
										inDictionary={data.inDictionary}
										dictionaryEntryId={data.dictionaryEntryId}
										currentFolderId={data.dictionaryFolder?.id ?? null}
										currentFolderName={data.dictionaryFolder?.name ?? null}
									/>
								)
							) : null}
						</motion.div>
					)}
				</AnimatePresence>,
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
